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
var df = new DataFrame(data);

console.log("Sum of ages:", df.sum('age'));
console.log("Average age:", df.avg('age'));
console.log("Count:", df.count());
console.log("Unique count of cities:", df.uniqueCount('city'));
console.log("Group by city:", df.groupBy('city'));
console.log("Having count > 1:", df.having('city', group => group.length > 1));
console.log("Where age > 30:", df.where(row => row.age > 30).data);
