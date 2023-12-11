class DataFrame {
    constructor(data) {
        this.data = data;
    }

    show() {
        console.table(this.data);
    }

    sum(column) {
        return this.data.reduce((acc, row) => acc + (row[column] || 0), 0);
    }

    avg(column) {
        return this.sum(column) / this.data.length;
    }

    count() {
        return this.data.length;
    }

    uniqueCount(column) {
        return new Set(this.data.map(row => row[column])).size;
    }

    groupBy(column) {
        return this.data.reduce((groups, row) => {
            const key = row[column];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(row);
            return groups;
        }, {});
    }

    having(column, condition) {
        const grouped = this.groupBy(column);
        return Object.keys(grouped).filter(key => condition(grouped[key])).map(key => ({ [column]: key, count: grouped[key].length }));
    }

    where(predicate) {
        return new DataFrame(this.data.filter(predicate));
    }
}

// Example usage:
const data = [
    { name: 'Alice', age: 25, city: 'New York' },
    { name: 'Bob', age: 30, city: 'San Francisco' },
    { name: 'Charlie', age: 35, city: 'Los Angeles' }
];

const df = new DataFrame(data);

console.log("Sum of ages:", df.sum('age'));
console.log("Average age:", df.avg('age'));
console.log("Count:", df.count());
console.log("Unique count of cities:", df.uniqueCount('city'));
console.log("Group by city:", df.groupBy('city'));
console.log("Having count > 1:", df.having('city', group => group.length > 1));
console.log("Where age > 30:", df.where(row => row.age > 30).data);
