const config = {
  dbStoreTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  refreshInterval: 5,
  sendNotification: true,
  sendEvents: true,
  sendPushover: true,
  logImages: true,
  urls: {
    "mobile.de": [
      "https://suchen.mobile.de/fahrzeuge/search.html?categories=Alcoves&categories=Integrated&categories=MotorHomesAndOther&categories=MotorHomesAndPickup&categories=OtherMotorhome&categories=PartlyIntegrated&categories=VanMotorhome&cn=DE&damageUnrepaired=NO_DAMAGE_UNREPAIRED&grossPrice=true&isSearchRequest=true&maxPrice=51000&minPrice=20000&od=down&ref=ess&refId=18112140&sb=doc&scopeId=MH&sset=1644647117&ssid=18112140",
      "https://suchen.mobile.de/fahrzeuge/search.html?cn=DE&damageUnrepaired=NO_DAMAGE_UNREPAIRED&grossPrice=true&isSearchRequest=true&maxMileage=200000&maxPrice=50000&minConstructionYear=2010&ms=25200;;;t5%20california&ms=25200;;;t6%20california&od=down&ref=ess&refId=17838825&sb=doc&scopeId=MH&ssid=17838825",
      "https://suchen.mobile.de/fahrzeuge/search.html?adLimitation=NONE&damageUnrepaired=NO_DAMAGE_UNREPAIRED&grossPrice=true&isSearchRequest=true&maxMileage=100000&maxPowerAsArray=110&maxPowerAsArray=KW&maxPrice=50000&minPowerAsArray=96&minPowerAsArray=KW&ms=25200;;3;4motion&od=down&ref=ess&refId=17651541&sb=doc&scopeId=C&ssid=17651541",
      "https://suchen.mobile.de/fahrzeuge/search.html?cn=DE&damageUnrepaired=NO_DAMAGE_UNREPAIRED&grossPrice=true&isSearchRequest=true&maxMileage=200000&maxPowerAsArray=110&maxPowerAsArray=KW&maxPrice=50000&minConstructionYear=2010&minPowerAsArray=96&minPowerAsArray=KW&ms=25200;;;t5%20california&ms=25200;;;t6%20california&od=down&ref=ess&refId=17650318&sb=doc&scopeId=MH&ssid=17650318",
    ],
    "autoscout.de": [
      "https://www.autoscout24.de/lst-caravan/?ocs_listing=include&sort=age&desc=1&ustate=N%2CU&size=20&page=1&cy=D&priceto=50000&kmto=150000&body=201%2C202%2C203%2C204%2C207&atype=N&recommended_sorting_based_id=a14a1856-c225-492d-8658-408d3acbc442&",
      "https://www.autoscout24.de/lst/volkswagen/t5-(alle)/ve_4motion?fregfrom=2010&sort=age&desc=1&cy=D&atype=C&ustate=N%2CU&powertype=hp&powerfrom=96&powerto=110&priceto=50000&ocs_listing=include&version0=4motion&search_id=3fr6b2yjf8",
      "https://www.autoscout24.de/lst/volkswagen/t5-california?fregfrom=2010&sort=age&desc=1&cy=D&atype=C&ustate=N%2CU&powertype=hp&powerfrom=96&powerto=110&priceto=50000&ocs_listing=include&search_id=11gskovofcw",
      "https://www.autoscout24.de/lst/volkswagen/t6-california?fregfrom=2010&sort=age&desc=1&cy=D&atype=C&ustate=N%2CU&powertype=hp&powerfrom=96&powerto=110&priceto=50000&ocs_listing=include&search_id=1o129he94o7",
    ],
    "autosuche.de": [
      "https://www.autosuche.de/api/v1/car/search2?t_model=BQWF&t_manuf=BQ&pageitems=12&page=1&sort=DATE_OFFER&sortdirection=DESC",
      "https://www.autosuche.de/api/v1/car/search2?t_model=BQDX&t_manuf=BQ&pageitems=12&page=1&sort=DATE_OFFER&sortdirection=DESC"
    ],
    "ebay-kleinanzeigen.de": [
      "https://www.ebay-kleinanzeigen.de/s-autos/t5-california/k0c216",
      "https://www.ebay-kleinanzeigen.de/s-autos/t6-california/k0c216",
    ]
  }
};

export default config
