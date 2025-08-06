const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // 监听控制台日志
    page.on('console', msg => {
      console.log('Console:', msg.text());
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      console.error('Page Error:', error.message);
    });
    
    console.log('正在访问前端页面...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 检查页面标题
    const title = await page.title();
    console.log('页面标题:', title);
    
    // 检查是否有主要元素
    const hasHeader = await page.$('header') !== null;
    const hasMain = await page.$('main') !== null;
    const hasSelect = await page.$('select') !== null;
    
    console.log('页面元素检查:');
    console.log('- Header存在:', hasHeader);
    console.log('- Main存在:', hasMain);
    console.log('- Select存在:', hasSelect);
    
    // 检查选择器选项数量
    if (hasSelect) {
      const optionCount = await page.$$eval('select option', options => options.length);
      console.log('- 选择器选项数量:', optionCount);
    }
    
    // 检查是否有数据显示
    const hasDataOverview = await page.$('[class*="DataOverview"], .bg-white') !== null;
    console.log('- 数据概览模块存在:', hasDataOverview);
    
    console.log('前端测试完成！');
    
  } catch (error) {
    console.error('测试失败:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
})();
