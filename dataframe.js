/*!
 * Copyright (c) 2023 Mediasoft & Cie S.A.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class DataFrame {
    constructor(data) {
        this.data = data;
    }
    // get dataframe headers
    get headers() {
        return Object.keys(this.data[0]);
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
    // Returns a new DataFrame with the rows sorted by the column
    // Example: df.sortBy('age')
    sortBy(column) {
        return new DataFrame(this.data.sort((a, b) => a[column] - b[column]));
    }
    // Returns a new DataFrame with the rows sorted by the column in descending order
    // Example: df.sortByDesc('age')
    sortByDesc(column) {
        return new DataFrame(this.data.sort((a, b) => b[column] - a[column]));
    }
    // Returns a new DataFrame with the rows sorted by the columns
    // Example: df.sortBy('age', 'name')    
    sortByColumns(...columns) {
        return new DataFrame(this.data.sort((a, b) => {
            for (let column of columns) {
                if (a[column] !== b[column]) {
                    return a[column] - b[column];
                }
            }
            return 0;
        }));
    }
    // Returns a new DataFrame with the rows sorted by the columns in descending order
    // Example: df.sortByDesc('age', 'name')    
    sortByColumnsDesc(...columns) {
        return new DataFrame(this.data.sort((a, b) => {
            for (let column of columns) {
                if (a[column] !== b[column]) {
                    return b[column] - a[column];
                }
            }
            return 0;
        }));
    }
    // Returns a new DataFrame with the rows sorted by the columns in descending order
    // Example: df.sortByColumns('age', 'name')
    // Example: df.sortByColumns('age', 'name').show()
    // Example: df.sortByColumns('age', 'name').show(2)
    // Example: df.sortByColumns('age', 'name').show(2, 5)
    // Example: df.sortByColumns('age', 'name').show(2, 5, true)
    show(start, end, truncate) {
        const columns = Object.keys(this.data[0]);
        const header = columns.join('\t');
        const rows = this.data.slice(start, end).map(row => columns.map(column => row[column]).join('\t'));
        console.log(header);
        console.log(rows.join('\n'));
        if (truncate) {
            console.log('...');
        }
    }
    // return a new dataframe with the selected columns 
    select(...columns) {
        return new DataFrame(this.data.map(row => {
            const selected = {};
            for (let column of columns) {
                selected[column] = row[column];
            }
            return selected;
        }));
    }
    // return a new dataframe with the selected columns renamed
    rename(mapping) {
        return new DataFrame(this.data.map(row => {
            const renamed = {};
            for (let column in row) {
                renamed[mapping[column] || column] = row[column];
            }
            return renamed;
        }));
    }
    // return a new dataframe with the selected columns renamed
    withColumn(column, fn) {
        return new DataFrame(this.data.map(row => ({ ...row, [column]: fn(row) })));
    }
    // return a new dataframe with the selected columns renamed
    withColumnRenamed(column, newColumn) {
        return new DataFrame(this.data.map(row => {
            const newRow = { ...row };
            newRow[newColumn] = newRow[column];
            delete newRow[column];
            return newRow;
        }));
    }

    // drop the selected columns
    drop(...columns) {
        return new DataFrame(this.data.map(row => {
            const selected = { ...row };
            for (let column of columns) {
                delete selected[column];
            }
            return selected;
        }));        
    }
    // return a new dataframe with calculated columns
    // Example: df.withColumn('ageInMonths', row => row.age * 12)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).show()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).show(2)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).show(2, 5)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).show(2, 5, true)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').show()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').show(2)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').show(2, 5)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').show(2, 5, true)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths')
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').show()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').show(2)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').show(2, 5)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').show(2, 5, true)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().show()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().show(2)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().show(2, 5)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().show(2, 5, true)
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().count()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().count().show()
    // Example: df.withColumn('ageInMonths', row => row.age * 12).select('ageInMonths').avg('ageInMonths').count().count().show(2)
    // return a new dataframe with joined columns form the other dataframe
    // Example: df.join(df2, 'id')
    // Example: df.join(df2, 'id').show()
    // Example: df.join(df2, 'id').show(2)
    // Example: df.join(df2, 'id').show(2, 5)   
    // Example: df.join(df2, 'id').show(2, 5, true)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').show()
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').show(2)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.join(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    join(df2, column) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with merge columns form the other dataframe
    // Example: df.merge(df2, 'id')
    // Example: df.merge(df2, 'id').show()
    // Example: df.merge(df2, 'id').show(2)
    // Example: df.merge(df2, 'id').show(2, 5)
    // Example: df.merge(df2, 'id').show(2, 5, true)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').show()
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').show(2)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.merge(df2, 'id').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    merge(df2, column) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with joined columns form the other dataframe with the same column name
    // Example: df.join(df2)
    // Example: df.join(df2).show()
    // Example: df.join(df2).show(2)
    // Example: df.join(df2).show(2, 5)
    // Example: df.join(df2).show(2, 5, true)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.join(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.join(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    join(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }        
    // return a new dataframe with merged columns form the other dataframe with the same column name
    // Example: df.merge(df2)
    // Example: df.merge(df2).show()
    // Example: df.merge(df2).show(2)
    // Example: df.merge(df2).show(2, 5)
    // Example: df.merge(df2).show(2, 5, true)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.merge(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    merge(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with summed columns form the other dataframe with the same column name    
    // Example: df.sum(df2)
    // Example: df.sum(df2).show()
    // Example: df.sum(df2).show(2)
    // Example: df.sum(df2).show(2, 5)
    // Example: df.sum(df2).show(2, 5, true)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.sum(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    sum(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with averaged columns form the other dataframe with the same column name
    // Example: df.avg(df2)
    // Example: df.avg(df2).show()
    // Example: df.avg(df2).show(2)
    // Example: df.avg(df2).show(2, 5)
    // Example: df.avg(df2).show(2, 5, true)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.avg(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    avg(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with summed columns form the other dataframe with the different column name 
    // Example: df.sum(df2, 'id', 'id2')
    // Example: df.sum(df2, 'id', 'id2').show()
    // Example: df.sum(df2, 'id', 'id2').show(2)
    // Example: df.sum(df2, 'id', 'id2').show(2, 5)
    // Example: df.sum(df2, 'id', 'id2').show(2, 5, true)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show()
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.sum(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    sum(df2, column, newColumn) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with averaged columns form the other dataframe with the different column name
    // Example: df.avg(df2, 'id', 'id2')
    // Example: df.avg(df2, 'id', 'id2').show()
    // Example: df.avg(df2, 'id', 'id2').show(2)
    // Example: df.avg(df2, 'id', 'id2').show(2, 5)
    // Example: df.avg(df2, 'id', 'id2').show(2, 5, true)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show()
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.avg(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    avg(df2, column) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with difference columns form the other dataframe with the different column name 
    // Example: df.diff(df2, 'id', 'id2')
    // Example: df.diff(df2, 'id', 'id2').show()
    // Example: df.diff(df2, 'id', 'id2').show(2)
    // Example: df.diff(df2, 'id', 'id2').show(2, 5)
    // Example: df.diff(df2, 'id', 'id2').show(2, 5, true)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show()
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.diff(df2, 'id', 'id2').select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    diff(df2, column, newColumn) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with product columns form the other dataframe with the same column name
    // Example: df.product(df2)
    // Example: df.product(df2).show()
    // Example: df.product(df2).show(2)
    // Example: df.product(df2).show(2, 5)
    // Example: df.product(df2).show(2, 5, true)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.product(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.product(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    product(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }
    // return a new dataframe with quotient columns form the other dataframe with the same column name
    // Example: df.quotient(df2)
    // Example: df.quotient(df2).show()
    // Example: df.quotient(df2).show(2)
    // Example: df.quotient(df2).show(2, 5)
    // Example: df.quotient(df2).show(2, 5, true)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').show()
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').show(2)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').show(2, 5)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').show(2, 5, true)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').show()
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').show(2)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').show(2, 5, true)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').count()
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').count().show()
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5)
    // Example: df.quotient(df2).select('name', 'age', 'city', 'country').avg('age').count().show(2, 5, true)
    quotient(df2) {
        const mapping = df2.groupBy(column);
        return new DataFrame(this.data.map(row => ({ ...row, ...mapping[row[column]][0] })));
    }   
    // return a new dataframe with columns grouped by the selected column
    // Example: df.groupBy('country')
    // Example: df.groupBy('country').show()
    // Example: df.groupBy('country').show(2)
    

}


