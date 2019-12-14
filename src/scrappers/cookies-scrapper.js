const scrap = async (page, waitTime = 0) => {
  let pageCookies = await page.cookies();
  if(waitTime){
      await page.waitFor(waitTime);
      pageCookies = await page.cookies();
  }
  const pageUrl = page.url();
  pageCookies.forEach(cookie => {
    console.log(`cookie found in ${pageUrl}: ${cookie.name} | ${cookie.value} | ${cookie.domain}`);
  });
  return pageCookies;
};

module.exports = {
  scrap
};
