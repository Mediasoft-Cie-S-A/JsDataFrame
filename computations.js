
const df = new DataFrame(data);

console.log("Sum of ages:", df.sum('age'));
console.log("Average age:", df.avg('age'));
console.log("Count:", df.count());
console.log("Unique count of cities:", df.uniqueCount('city'));
console.log("Group by city:", df.groupBy('city'));
console.log("Having count > 1:", df.having('city', group => group.length > 1));
console.log("Where age > 30:", df.where(row => row.age > 30).data);
