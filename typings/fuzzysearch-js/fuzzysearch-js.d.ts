//
//
// declare class Fuzzy {
//
//   constructor(items: any[], config: any);
//
//   search(query: string): any[];
//
//   addModule(item: any): void;
// }
//
// // declare module inner {
// //   interface FuzzySearch {
// //     new (items: any[], config: any): any;
// //     search(query: string): any[];
// //     addModule(item: any): void;
// //   }
// // }
//
//
// declare module 'fuzzysearch-js' {
//
//   // interface FuzzySearch {
//   //   new (items: any[], config: any): any;
//   //   search(query: string): any[];
//   //   addModule(item: any): void;
//   // }
//   // export = inner;
//
//   export var FuzzySearch: Fuzzy;
// }

interface FuzzySearch {
  search(query: string): any[];
  addModule(item: any): void;
}


interface FuzzyFactory {
  new (items: any[], config: any): FuzzySearch;
}

declare module 'fuzzysearch-js' {

  export var FuzzySearch: FuzzyFactory;
}
