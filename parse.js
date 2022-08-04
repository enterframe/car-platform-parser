import parser from "node-html-parser"
import got from "got"

const { parse } = parser;

const parseMobileDe = (root, service) => {
  return root.querySelectorAll('.cBox-body .result-item:not(.result-item--page1):not(.inline-banner)').map((item) => ({
    // id, url
    ...{
      id: item.attrs['data-ad-id'],
      url: item.attrs['href'],
    },
    // title
    ...(node => ({
      title: node?.querySelector('> .h3').innerText,
      onlineSince: node?.querySelector('> .h3 + span').innerText,
    }))(item.querySelector('.headline-block')),
    // price
    ...(node => ({
      price: node?.querySelector('.h3').innerText,
    }))(item.querySelector('.price-block')),
    // image
    ...(node => ({
      image: node?.attrs['src'] || node?.attrs['data-src'] || null,
    }))(item.querySelector('img')),
    // desc, seller
    ...(node => ({
      desc: node?.querySelectorAll('.g-col-12:first-child > div > div')?.map(n => n.innerText).filter(Boolean),
      seller: node?.querySelectorAll('.g-col-12 + .g-col-12 > div > div')?.map(n => n.innerText).filter(Boolean)
    }))(item.querySelector('.g-col-8 > .g-row + .g-row, .g-col-9 > .g-row + .g-row')),
    // date, service
  	...{
      date: new Date().getTime(),
      service,
    }
  }))
  .filter(({id, title, url}) => id && title && url)
}

const parseAutoscoutDe = (root, service) => {
  return root.querySelectorAll('.cldt-summary-full-item, .cldt-summary-full-item-main').map((item) => ({
    // id, url, title, price
    ...{
      id: item.attrs['id'],
      url: `https://www.autoscout24.de${item.querySelector('a').attrs['href']}`,
      title: `${item.querySelector('h2')?.innerText} ${item.querySelector('h2 + span, h2 + h2')?.innerText}`,
      price: (item?.querySelector('.cldt-price')?.innerText || `€ ${item.attrs['data-tracking-price']}.-`).replace(/\n/, ''),
    },
    // image
    ...(node => ({
      image: node?.attrs['src'] || node?.attrs['data-src'] || null,
    }))(item.querySelector('img')),
    // desc
    ...(node => {
      let desc = node?.map(n => n.innerText.trim()).filter(Boolean).join(', ')
      desc = desc || item.querySelectorAll('[type="mileage"], [type="registration-date"], [type="power"], [type="offer-type"], [type="previous-owners"], [type="transmission-type"], [type="fuel-category"]').map(n => n.innerText).filter(Boolean).filter(n => n[0] !== '-').join(', ')
      return {desc: [desc]}
    })(item.querySelectorAll('ul[data-item-name="vehicle-details"] > li:not([data-placeholder])')),
    // date, service
    ...{
      date: new Date().getTime(),
      service,
    }
  }))
  .filter(({id, title, url}) => id && title && url)
}

const parseEbayKleinanzeigenDe = (root, service) => {
  return root.querySelectorAll('.ad-listitem > article').map((item) => ({
    // id, url, title, price, image, desc, date, service
    ...{
      id: item.attrs['data-adid'],
      url: `https://www.ebay-kleinanzeigen.de${item.querySelector('h2 a').attrs['href']}`,
      title: item.querySelector('h2 a')?.innerText,
      price: item.querySelector('.aditem-main--middle--price')?.innerText.trim(),
      image: item.querySelector('.imagebox')?.attrs['data-imgsrc'],
      desc: [item.querySelectorAll('.text-module-end span')?.map(x => x.innerText).join(', ')],
      date: new Date().getTime(),
      service,
    },
  }))
  .filter(({id, title, url}) => id && title && url)
}

const parseAutosucheDe = (root, service) => {
  const data = JSON.parse(root)
  return data.carkeys.map(carkey => {
    const car = data.cars[carkey]
    const desc = [
      `${car.mileage?.value} ${car.mileage?.unit}`,
      `${car.modelyear?.value}`,
      `${car.motor?.fuel?.value}`,
      `${car.motor?.powerPs?.value} ${car.motor?.powerPs?.unit}`,
    ].filter(Boolean).join(', ')
    return {
      id: carkey,
      title: car?.title?.value,
      url: `https://www.autosuche.de/auto/${carkey}?viewMode=tile`,
      image: car?.images?.[0]?.href,
      price: `€ ${car?.price.value}`,
      desc: [desc],
      date: new Date().getTime(),
      service,
    }
  })
  .filter(({id, title, url}) => id && title && url)
}

const parseHtml = (service, html) => {
  switch (service) {
    case 'mobile.de':
      return parseMobileDe(parse(html), service)
    case 'autoscout.de':
      return parseAutoscoutDe(parse(html), service)
    case 'autosuche.de':
      return parseAutosucheDe(html, service)
    case 'ebay-kleinanzeigen.de':
      return parseEbayKleinanzeigenDe(parse(html), service)
    default:
      return {};
  }
}

const parse$ = async ({service, url}) => {
  let response;
  try {
    response = await got(url, {
      timeout: {
        request: 5000,
      },
      headers: {
        'user-agent': 'HTTPie/3.0.2',
      }
    })
  } catch(e) {
    throw new Error(e)
  }
  return parseHtml(service, response.body)
}

export default parse$
