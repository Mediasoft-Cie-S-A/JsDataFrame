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


