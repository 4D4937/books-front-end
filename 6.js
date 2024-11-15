const fs = require('fs');
const path = require('path');

// 获取当前目录
const currentDir = process.cwd();
console.log('当前目录:', currentDir);

// 读取目录内容
function listFiles(dirPath) {
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        console.log(`📁 ${file}`);  // 文件夹
      } else {
        console.log(`📄 ${file}`);  // 文件
      }
    });
  } catch (error) {
    console.error('读取目录失败:', error);
  }
}

// 调用函数
listFiles(currentDir);