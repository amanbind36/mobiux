const fs = require('fs');
const filePath = './data.csv';
let data = fs.readFileSync(filePath, 'utf-8');
data = data.split('\n');


const headers = data[0].split(',');


const rows = data.slice(1).filter(row => row.trim() !== '').map(row => {
    const values = row.split(',');
    return headers.reduce((acc, header, index) => {
        acc[header.trim()] = values[index].trim();
        return acc;
    }, {});
});


function totalSales(data) {
    return data.reduce((total, row) => {
        return total + parseFloat(row.Total_Price);
    }, 0);
}

function monthWiseSales(rows) {
    const salesByMonth = {};
    rows.forEach(row => {
        const month = row.Date.slice(0, 7); 
        const totalPrice = parseFloat(row['Total_Price']); 
        salesByMonth[month] = (salesByMonth[month] || 0) + totalPrice;
    });
    return salesByMonth;
}



function mostPopularItems(rows) {
    const itemsByMonth = {};
    
   
    rows.forEach(row => {
        const month = row.Date.slice(0, 7); 
        const itemName = row.SKU; 
        const quantitySold = parseInt(row.Quantity) || 0; 
        if (!itemsByMonth[month]) itemsByMonth[month] = {};
        itemsByMonth[month][itemName] = (itemsByMonth[month][itemName] || 0) + quantitySold;
    });

    
    const result = {};
    for (const month in itemsByMonth) {
        result[month] = Object.keys(itemsByMonth[month]).reduce((a, b) =>
            itemsByMonth[month][a] > itemsByMonth[month][b] ? a : b
        );
    }

    return result;
}

function mostRevenueItems(data) {
    const revenueByMonth = {};
    data.forEach(row => {
        const month = row.date.slice(0, 7);
        if (!revenueByMonth[month]) revenueByMonth[month] = {};
        revenueByMonth[month][row.item_name] = (revenueByMonth[month][row.item_name] || 0) + parseFloat(row.revenue);
    });
    const result = {};
    for (const month in revenueByMonth) {
        result[month] = Object.keys(revenueByMonth[month]).reduce((a, b) => 
            revenueByMonth[month][a] > revenueByMonth[month][b] ? a : b
        );
    }
    return result;
}



function mostRevenueItems(rows) {
    const revenueByMonth = {};
    
    
    rows.forEach(row => {
        const month = row.Date.slice(0, 7); 
        const itemName = row.SKU; 
        const revenue = parseFloat(row['Total_Price']) || 0; 

        if (!revenueByMonth[month]) revenueByMonth[month] = {};
        revenueByMonth[month][itemName] = (revenueByMonth[month][itemName] || 0) + revenue;
    });

    const result = {};
    for (const month in revenueByMonth) {
        result[month] = Object.keys(revenueByMonth[month]).reduce((a, b) =>
            revenueByMonth[month][a] > revenueByMonth[month][b] ? a : b
        );
    }

    return result;
}




function popularityStats(rows, mostPopular) {
    const stats = {};
    
    rows.forEach(row => {
        const month = row.Date.slice(0, 7); 
        if (mostPopular[month] === row.SKU) {
            if (!stats[month]) stats[month] = [];
            stats[month].push(parseInt(row.Quantity) || 0); 
        }
    });

    
    const result = {};
    for (const month in stats) {
        const quantities = stats[month];
        if (quantities.length > 0) {
            result[month] = {
                min: Math.min(...quantities),
                max: Math.max(...quantities),
                average: quantities.reduce((a, b) => a + b, 0) / quantities.length
            };
        } else {
            result[month] = { min: 0, max: 0, average: 0 }; // Handle empty data gracefully
        }
    }

    return result;
}


const popular = mostPopularItems(rows);
console.log(popularityStats(rows, popular));
