import config from "./config.js";
import connect from "./db.js"
import mongoose from "mongoose"
import chalk from "chalk"
import parse$ from "./parse.js"
import terminalLink from "terminal-link"
import ansiEscapes from "ansi-escapes"
import got from "got"
import notifier from "node-notifier"
import Push from "pushover-notifications"
import shortUrl from "node-url-shortener"
import { Subject } from 'rxjs';

const $items = new Subject()

const push = new Push( {
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  onerror: (e) => {
    process.stdout.write('\n')
    console.log(chalk.red(`Error sending pushover: ${e}`));
  }
})

const note = new notifier.NotificationCenter()

// flatten urls
const urls = Object.entries(config.urls).map(([service, urls]) => urls.map((url) => ({service, url}))).flat()

// logging
const success = msg => console.log(chalk.green(msg))

const ItemModel = mongoose.model('Item', {
  id: String,
  service: String,
  url: String,
  title: String,
  onlineSince: String,
  image: String,
  price: String,
  desc: [String],
  seller: [String],
  date: String,
})

const store = async (model, data) => {
  const found = await model.findOne({id: data.id})
  return found ? false : await new model(data).save() && true
}

const removeOld = async (model) => {
  await model.deleteMany({date: {$lte: (new Date().getTime() - config.dbStoreTime)}})
}

const notify = async (item, image) => {
  config.sendNotification && note.notify(
    {
      title: item.title,
      message: `${item.desc?.[0]}\n${item.price}`,
      icon: item.image,
      contentImage: item.image,
      sound: false,
      wait: true,
      sticky: true,
      open: item.url,
    },
    (err, response, metadata) => {}
  )

  shortUrl.short(item.url, (err, url) => {
    const msg = {
      title: item.title,
      message: `${item.desc?.[0]}, ${item.price}`,
      url,
      url_title: item.service,
      sound: 'intermission',
      device: 'xxx',
      priority: 0,
    }
    msg.file = image && {name: 'car.png', data: image.rawBody }
    config.sendPushover && push.send( msg, (err, result) => {})
  })
}

const log = async (item) => {
  // request image
  let image
  try {
    image = item.image && await got(item.image, {
      headers: {
        'user-agent': 'HTTPie/3.0.2',
      }
    })
  } catch (e) {
  }

  await notify(item, image)
  config.sendEvents && $items.next(item)

  process.stdout.write('\n')
  config.logImages && image && console.log(ansiEscapes.image(image.rawBody, {width: "400px", preserveAspectRatio: true}))
  const link = terminalLink(item.title, item.url)
  success(`${link}`)
  console.log(chalk.white(item.service));
  console.log(chalk.white(new Date(item.date).toLocaleString()));
  console.log(chalk.grey(item.desc?.join('\n')));
  console.log(chalk.yellow(item.price));
  process.stdout.write('\x07')
}

const start = async (urlIndex = 0) => {
  const job =  urls[urlIndex];
  let items = []
  try {
    items = await parse$(job)
  } catch(e) {
    process.stdout.write('\n')
    console.log(chalk.red(`Error getting data: ${e}`));
  }

  await removeOld(ItemModel)

  for (const key in items) {
    const item = {...items[key], ...{id: `${items[key]['service']}-${items[key]['id']}`}}
    const stored = await store(ItemModel, item)
    stored && await log(item)
  }
  process.stdout.write('.')
  urlIndex = urlIndex > urls.length - 2 ? 0 : ++urlIndex;
  setTimeout(() => start(urlIndex), config.refreshInterval * 1000)
}

connect(() => {
  start()
})

export default $items
