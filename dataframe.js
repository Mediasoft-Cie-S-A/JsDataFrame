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
    // declare data property
    data = [];
    // constructor of dataframe
    constructor(data) {
        if (data === undefined) {
          this.data = [];
        }
        else
        {
        this.data = data;     
        }
    }
    //convert to array
    toArray() {
        return this.data;
    }
    // insert row to dataframe
    push(row) {
        this.data.push(row);
     
    }
    // get dataframe headers
    headers() {
      //  console.log(this.data[0]);
      // check if data is empty
        if(this.data.length === 0)
        {
            return [];
        }

        return Object.keys(this.data[0]);
    }

    // get count of rows    
    count() {
        return this.data.length;
    }
    // sum of array
    sumArray(array) {
        return array.reduce((a, b) => a + b, 0);
    }

    
    // sum column and retun value
    sum(column) {
        var sum = 0;
         // check is column exist
         if (this.data[1][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }

        // check if column is number
        if (isNaN(this.data[1][column])) {
            throw new Error('Column ' + column + ' is not a number');
        }
        for (var i = 0; i < this.data.length; i++) {
           
            console.log(this.data[i][column]);
            sum += this.data[i][column];
        }
        return sum ;
    }

    // get max value of column
    max(column) {
        var max = 0;
        for (var i = 0; i < this.data.length; i++) {
            // check is column exist
            if (this.data[i][column] === undefined) {
                // rise error
                throw new Error('Column ' + column + ' does not exist');
            }

            // check if column is number
            if (isNaN(this.data[i][column])) {
                throw new Error('Column ' + column + ' is not a number');
            }
            if (max < this.data[i][column]) {
                max = this.data[i][column];
            }
        }
        return max;
    }   
    // get min value of column
    min(column) {
        var min = 0;
         // check is column exist
         if (this.data[0][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }

        // check if column is number
        if (isNaN(this.data[0][column])) {
            throw new Error('Column ' + column + ' is not a number');
        }
        for (var i = 0; i < this.data.length; i++) {
           
            if (min > this.data[i][column]) {
                min = this.data[i][column];
            }
        }
        return min;
    }
    // get average value of column
    avg(column) {
        var sum = 0;
         // check is column exist
         if (this.data[0][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }

        // check if column is number
        if (isNaN(this.data[0][column])) {
            throw new Error('Column ' + column + ' is not a number');
        }
        for (var i = 0; i < this.data.length; i++) {
           
            sum += this.data[i][column];
        }
        return sum / this.data.length;
    }
    // get median value of column
    median(column) {
        var median = 0;
        var values = [];
         // check is column exist
         if (this.data[0][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }

        // check if column is number
        if (isNaN(this.data[0][column])) {
            throw new Error('Column ' + column + ' is not a number');
        }
        for (var i = 0; i < this.data.length; i++) {
           
            values.push(this.data[i][column]);
        }
        values.sort(function (a, b) { return a - b; });
        var half = Math.floor(values.length / 2);
        if (values.length % 2) {
            median = values[half];
        } else {
            median = (values[half - 1] + values[half]) / 2.0;
        }
        return median;
    }
    // get variance value of column
    variance(column) {
        var variance = 0;
         // check is column exist
         if (this.data[0][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }

        // check if column is number
        if (isNaN(this.data[0][column])) {
            throw new Error('Column ' + column + ' is not a number');
        }
        var avg = this.avg(column);

        for (var i = 0; i < this.data.length; i++) {
           
            variance += Math.pow(this.data[i][column] - avg, 2);
        }
        return variance / this.data.length;
    }
    // get standard deviation value of column
    std(column) {
        return Math.sqrt(this.variance(column));
    }
    // get distinct values of column
    distinct(column) {
        var distinct = [];
        for (var i = 0; i < this.data.length; i++) {
            // check is column exist
            if (this.data[i][column] === undefined) {
                // rise error
                throw new Error('Column ' + column + ' does not exist');
            }
            if (!distinct.includes(this.data[i][column])) {
                distinct.push(this.data[i][column]);
            }
        }
        return distinct;
    }
    
    // get dataframe rows
    rows() {
        return this.data;
    }
    // get dataframe row by index
    row(index) {
        return this.data[index];
    }
    // get dataframe column by name
    column(column) {
        var values = new DataFrame();
          // check is column exist
          if (this.data[0][column] === undefined) {
            // rise error
            throw new Error('Column ' + column + ' does not exist');
        }
        for (var i = 0; i < this.data.length; i++) {
          
            values.push(this.data[i][column]);
        }
        return values;
    }
    // get dataframe column by index
    columnByIndex(index) {
        var values = new DataFrame();
        for (var i = 0; i < this.data.length; i++) {
            values.push(this.data[i][this.headers()[index]]);
        }
        return values;
    }
    // get dataframe group by columns
    groupBy(columns) {
        var groups = new DataFrame();
        // get headers
    
        for (var i = 0; i < this.data.length; i++) {
            // create aggregate key
            var row = [];
            
            for(var j=0; j<columns.length; j++)
            {              
                // key, value
                row[columns[j]]=this.data[i][columns[j]];                
            }           
            
            groups.push(row);
        }
        return groups;
    }

    // generate index of position of the columns
    // example : df.createIndex(['nste', 'somo', 'socv']);
    // create btree index for the columns of the first dataframe
    // example : df.createIndex(['nste', 'somo', 'socv']);
    createColumnIndex(column) {
        var index ={};
     
        for (var i = 0; i < this.data.length; i++) {
            // create aggregate key            
            var row = this.data[i][column] ;
         //  console.log(this.data[i]);
            // if row is not in index then add it and adding the data row
              if(index[row] === undefined)
              {
                index[row] = [];                
              }
              index[row].push(this.data[i]);                         
        }
       
        return index;
    }
   
    


      // get dataframe group by columns and aggregate by sum based on columns a key
      sumGroupBy(key,columns) {       
        var index = this.createColumnIndex(key);       
        // local hash table
        var sumColumns = {};
        // get sum of columns
        for (key in index) {
            // get the rows of the key
            var rows = index[key];
            for(var i=0; i<rows.length; i++)
            {
              //  console.log(rows[i]);
                // if row is not in hash table then add it
                if(sumColumns[key] === undefined)
                {
                    sumColumns[key] = [];
                    for(var j=0; j<columns.length; j++)
                    {
                        sumColumns[key][columns[j]] = 0;
                    }
                }
                // sum the columns
                for(var j=0; j<columns.length; j++)
                {
                    sumColumns[key][columns[j]] += rows[i][columns[j]];
                }
            }          
            
        }



        // convert hash table to dataframe
        var sumColumnsDf = new DataFrame();
        for (var key in sumColumns) {
            var row = [];
            row['key'] = key;
            for (var i = 0; i < columns.length; i++) {
                row[columns[i]] = sumColumns[key][columns[i]];
            }
            sumColumnsDf.push(row);
        }
        return sumColumnsDf;

    }

    // get distinct values of column
    distinct(column) {
        var distinct = new DataFrame();
        for (var i = 0; i < this.data.length; i++) {
            // check is column exist
            if (this.data[i][column] === undefined) {
                // rise error
                throw new Error('Column ' + column + ' does not exist');
            }
            if (!distinct.includes(this.data[i][column])) {
                distinct.push(this.data[i][column]);
            }
        }
        return distinct;
    }

    // create btree index for the columns of the first dataframe
    // example : df.createIndex(['nste', 'somo', 'socv']);
    createAggregateIndex(column) {
        var index = {};
     
        for (var i = 0; i < this.data.length; i++) {
            // create aggregate key
            var row = "";
            for(var j=0; j<column.length; j++)
            {
                row += this.data[i][column[j]] + "_";
            }
              // if row is not in index then add it and adding the data row
              if(index[row] === undefined)
                index[row] = [];
              
              index[row].push(this.data[i]);
            
             
        }
        return index;
    }
   
    // inner join two dataframe by condition
    // example : df1.merge(df2, 'row1["nste"] == row2["nste"] ', ['somo', 'socv']); 
    merge(df, jcolums, columns) {
        
        var index1 = this.createAggregateIndex(jcolums);
        var index2 = df.createAggregateIndex(jcolums);
        var mergedData = new DataFrame();
        for (var key in index1) {
            // adding the data row of the first dataframe
            var row1 = index1[key][0];
            if (index2[key] !== undefined) {
               // adding the data row of the second dataframe
                var row2 = index2[key][0];
                var row = [];
                row['key'] = key;
                for(var i=0; i<columns.length; i++)
                {
                    row[columns[i]] = row1[columns[i]];
                }
                for(var i=0; i<columns.length; i++)
                {
                    row[columns[i]+'_2'] = row2[columns[i]];
                }
               // console.log(row);
                mergedData.push(row);
            }
        }
        
        return  mergedData;
    }


    // filter dataframe by sql like condition
    // example : df.filter('row["srcv"] > 0')

    filter(condition) {
        var filteredData = new DataFrame();
        this.data.forEach(function (row) {
         //  filter by condition
         // eval() function evaluates JavaScript code represented as a string.
            if (eval(condition)) {
                filteredData.push(row);
            }
        });
        return filteredData;
    }

    


}
