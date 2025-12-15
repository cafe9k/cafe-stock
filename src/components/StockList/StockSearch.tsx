/**
 * 股票搜索组件
 */

import { Input, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useStockSearch } from "../../hooks/useStockSearch";
import type { Stock } from "../../types/stock";

const { Search } = Input;

export interface StockSearchProps {
	placeholder?: string;
	onSelect?: (stock: Stock) => void;
	onSearch?: (keyword: string) => void;
	style?: React.CSSProperties;
}

/**
 * 股票搜索组件
 */
export function StockSearch({ placeholder = "请输入股票代码或名称", onSelect, onSearch, style }: StockSearchProps) {
	const { searchResults, searching, search, clearSearch } = useStockSearch();

	const handleSearch = (value: string) => {
		if (onSearch) {
			onSearch(value);
		} else {
			search(value);
		}
	};

	const handleSelect = (tsCode: string) => {
		const stock = searchResults.find((s) => s.ts_code === tsCode);
		if (stock && onSelect) {
			onSelect(stock);
		}
	};

	return (
		<Space style={style}>
			<Search
				placeholder={placeholder}
				allowClear
				enterButton={<SearchOutlined />}
				onSearch={handleSearch}
				onChange={(e) => {
					if (!e.target.value) {
						clearSearch();
					}
				}}
				style={{ width: 300 }}
				loading={searching}
			/>
		</Space>
	);
}

