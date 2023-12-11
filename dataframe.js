class DataFrame {
    constructor(data) {
        this.data = data;
    }
    // Returns a new DataFrame with the selected columns
    show() {
        console.table(this.data);
    }
    // Returns a sum of the values in the column
    sum(column) {
        return this.data.reduce((acc, row) => acc + (row[column] || 0), 0);
    }
    // Returns an average of the values in the column
    avg(column) {
        return this.sum(column) / this.data.length;
    }
    // Returns the number of rows in the DataFrame
    count() {
        return this.data.length;
    }
    // Returns the values in the column as  count
    count(column) {
        return this.data.filter(row => row[column]).length;
    }
    // Returns the values in the column as unique count
    uniqueCount(column) {
        return new Set(this.data.map(row => row[column])).size;
    }
    // Returns the values gropued by the columns as an object
    groupBy(column) {
        return this.data.reduce((acc, row) => {
            const key = row[column];
            acc[key] = acc[key] || [];
            acc[key].push(row);
            return acc;
        }, {});
    }
    // Returns the values in the column as an array
    getColumn(column) {
        return this.data.map(row => row[column]);
    }
    having(column, condition) {
        const grouped = this.groupBy(column);
        return Object.keys(grouped).filter(key => condition(grouped[key])).map(key => ({ [column]: key, count: grouped[key].length }));
    }
    // predicate is a function that takes a row and returns true or false
    // Returns a new DataFrame with the rows that match the predicate
    // Example: df.where(row => row.age > 30)
    where(predicate) {
        return new DataFrame(this.data.filter(predicate));
    }
}


