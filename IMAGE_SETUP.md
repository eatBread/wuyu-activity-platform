# 活动封面图片设置说明

## 📁 文件夹结构

```
public/
└── images/
    └── activities/
        └── sports-field.svg
```

## 🖼️ 图片说明

### 当前使用的图片
- **文件名**: `sports-field.svg`
- **路径**: `/images/activities/sports-field.svg`
- **类型**: SVG矢量图
- **内容**: 运动场场景，包含跑道、足球场、跳高设备、跨栏、篮球架和孩子们

### 图片特点
- **矢量格式**: SVG格式，支持任意缩放不失真
- **运动主题**: 符合春季运动会的活动主题
- **色彩丰富**: 包含蓝色天空、绿色草地、红色跑道等
- **卡通风格**: 适合学校活动的活泼氛围

## 🔧 技术实现

### 背景图片设置
```jsx
<div 
  className="aspect-video relative bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/images/activities/sports-field.svg)'
  }}
>
  {/* 蒙版 */}
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
</div>
```

### 蒙版效果
- 使用 `bg-black bg-opacity-50` 创建50%透明度的黑色蒙版
- 确保文字和按钮在图片上清晰可见
- 保持图片的视觉层次

## 📱 响应式支持

- **桌面端**: 完整显示图片内容
- **移动端**: 自动适配屏幕尺寸
- **加载优化**: SVG格式文件小，加载快速

## 🔄 替换图片

如需替换为其他图片：

1. 将新图片放入 `public/images/activities/` 文件夹
2. 修改活动详情页面中的图片路径
3. 确保图片尺寸适合16:9比例（aspect-video）

## 📋 支持的图片格式

- **SVG** (推荐) - 矢量图，无损缩放
- **PNG** - 支持透明背景
- **JPG** - 适合照片类图片
- **WebP** - 现代格式，文件更小

## 🎨 设计建议

- 图片主题应与活动类型匹配
- 避免过于复杂的细节，确保文字可读性
- 建议使用明亮、积极的色彩
- 保持与整体绿色主题的协调性
