/**
 * 公告分类器使用示例
 */

import {
	classifyAnnouncement,
	classifyAnnouncements,
	getCategoryStats,
	getCategoryColor,
	getCategoryIcon
} from './announcementClassifier';

// ============= 示例 1: 单个公告分类 =============
console.log('示例 1: 单个公告分类');
console.log('─'.repeat(50));

const title1 = '2023年年度报告';
const category1 = classifyAnnouncement(title1);
console.log(`标题: ${title1}`);
console.log(`分类: ${category1}`);
console.log(`颜色: ${getCategoryColor(category1)}`);
console.log(`图标: ${getCategoryIcon(category1)}`);
console.log();

// ============= 示例 2: 批量分类 =============
console.log('示例 2: 批量分类');
console.log('─'.repeat(50));

const announcements = [
	{ id: 1, title: '2023年年度报告', ts_code: '000001.SZ' },
	{ id: 2, title: '关于股东增持公司股份的公告', ts_code: '000002.SZ' },
	{ id: 3, title: '董事会决议公告', ts_code: '000003.SZ' },
	{ id: 4, title: '关于使用闲置募集资金进行现金管理的公告', ts_code: '000004.SZ' },
	{ id: 5, title: '股票交易异常波动公告', ts_code: '000005.SZ' }
];

const classified = classifyAnnouncements(announcements);
classified.forEach(ann => {
	console.log(`${ann.title}`);
	console.log(`  → ${getCategoryIcon(ann.category)} ${ann.category}`);
});
console.log();

// ============= 示例 3: 分类统计 =============
console.log('示例 3: 分类统计');
console.log('─'.repeat(50));

const stats = getCategoryStats(announcements);
Object.entries(stats)
	.filter(([_, count]) => count > 0)
	.sort((a, b) => b[1] - a[1])
	.forEach(([category, count]) => {
		console.log(`${category}: ${count} 条`);
	});
console.log();

// ============= 示例 4: 在 React 组件中使用 =============
console.log('示例 4: React 组件示例代码');
console.log('─'.repeat(50));

const reactExample = `
import { Tag } from 'antd';
import { classifyAnnouncement, getCategoryColor, getCategoryIcon } from '@/utils/announcementClassifier';

// 在 Table 列定义中使用
const columns = [
  {
    title: '公告标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: '分类',
    dataIndex: 'title',
    key: 'category',
    width: 120,
    render: (title: string) => {
      const category = classifyAnnouncement(title);
      const color = getCategoryColor(category);
      const icon = getCategoryIcon(category);
      return (
        <Tag color={color}>
          {icon} {category}
        </Tag>
      );
    }
  }
];

// 在组件中使用
function AnnouncementTable({ data }) {
  // 添加分类信息
  const classifiedData = classifyAnnouncements(data);
  
  // 按分类筛选
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredData = selectedCategory
    ? classifiedData.filter(item => item.category === selectedCategory)
    : classifiedData;
  
  return (
    <div>
      <Select
        placeholder="选择分类"
        allowClear
        onChange={setSelectedCategory}
      >
        {Object.values(AnnouncementCategory).map(cat => (
          <Option key={cat} value={cat}>
            {getCategoryIcon(cat)} {cat}
          </Option>
        ))}
      </Select>
      
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
      />
    </div>
  );
}
`;

console.log(reactExample);

// ============= 示例 5: 分类覆盖率测试 =============
console.log('示例 5: 测试不同类型的公告');
console.log('─'.repeat(50));

const testCases = [
	'2024年第一季度报告',
	'关于2023年度利润分配预案的公告',
	'重大资产重组进展公告',
	'关于股份回购进展的公告',
	'第五届董事会第十次会议决议公告',
	'关于中标项目的公告',
	'股票交易异常波动公告',
	'关于日常关联交易的公告',
	'关于诉讼事项的公告',
	'关于对外投资设立子公司的公告',
	'关于为子公司提供担保的公告',
	'可转换公司债券付息公告',
	'内部控制自我评价报告',
	'关于通过高新技术企业认定的公告',
	'华夏基金旗下基金开放日常申购赎回业务的公告',
	'关于使用闲置募集资金进行现金管理的公告',
	'2024年股票期权激励计划公告',
	'投资者关系活动记录表',
	'关于公司2023年度持续督导报告书',
	'2023年环境、社会及治理（ESG）报告',
	'关于股东股份质押的公告'
];

testCases.forEach(title => {
	const category = classifyAnnouncement(title);
	const icon = getCategoryIcon(category);
	console.log(`${icon} ${category.padEnd(12)} | ${title}`);
});
console.log();

console.log('✅ 所有示例运行完成！');

