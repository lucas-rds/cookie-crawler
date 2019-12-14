const scrap = async page => {
  const urls = await page.$$eval("a", anchors =>
    anchors
      .map(anchor => anchor.href)
      .filter(href => href && href.includes("http"))
  );

  return urls;
};

module.exports = {
  scrap
};
