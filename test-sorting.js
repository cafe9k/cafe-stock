
const announcements = [
    { ann_date: "20240101", pub_time: "10:00:00" },
    { ann_date: "20240102", pub_time: "09:00:00" },
    { ann_date: "20231231", pub_time: "12:00:00" }
];

console.log("Original:", announcements);

announcements.sort((a, b) => {
    const dateCompare = (b.ann_date || "").localeCompare(a.ann_date || "");
    if (dateCompare !== 0) return dateCompare;
    return (b.pub_time || "").localeCompare(a.pub_time || "");
});

console.log("Sorted (Descending):", announcements);

const stocks = [
    { latest_ann_date: "20240101", stock_name: "A" },
    { latest_ann_date: "20240102", stock_name: "B" },
    { latest_ann_date: "20231231", stock_name: "C" }
];

stocks.sort((a, b) => {
    const dateCompare = (b.latest_ann_date || "").localeCompare(a.latest_ann_date || "");
    if (dateCompare !== 0) return dateCompare;
    return (a.stock_name || "").localeCompare(b.stock_name || "");
});

console.log("Sorted Stocks (Descending):", stocks);

