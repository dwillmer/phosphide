/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  ICommand
} from 'phosphor-command';

import {
  ICommandItem
} from './registry';

import {
  FuzzySearch
} from 'fuzzysearch-js';

// import * as FuzzySearch from 'fuzzysearch-js';

import {
  indexOfFS
} from 'fuzzysearch-js/js/modules/IndexOfFS';

import {
  wordCountFS
} from 'fuzzysearch-js/js/modules/WordCountFS';


/**
 * Interface that must be implemented by the search results.
 */
export
interface ICommandMatchResult {
  /**
   * The overall score assigned to this Command from the matching algorithm.
   *
   * #### Notes
   * This is useful in case we want to split the visual representation of
   * the results by an arbitrary parameter later on.
   */
  score: number;
  /**
   * The original text of the item
   */
  originalText: string;
  /**
   * The command object.
   */
  command: ICommandItem;
  /**
   * An optional parameter containing a representation of the original text with
   * additional markup.
   *
   * #### Notes
   * This is useful in cases where the visual representation may want to
   * highlight the parts of the text which matched the query, without performing
   * a secondary search.
   */
  matchedText?: string;
}


/**
 * An abstract base class for implementing command searchers.
 */
export
abstract class CommandMatcher {

  /**
   * Execute the search with the specified string argument.
   *
   * @param query - The string to be used as the search input.
   *
   * @param commands = The list of ICommand-conforming objects to
   *    search over.
   *
   * This abstract method must be implemented by a subclass.
   */
  abstract search(query: string, commands: ICommandItem[]): Promise<ICommandMatchResult[]>;
}


/**
 * A concrete implementation of CommandMatcher.
 */
export
class FuzzyMatcher extends CommandMatcher {

  /**
   * Execute the search with the specified string argument.
   *
   * @param query - The string to be used as the search input.
   *
   * @param commands - The list of ICommand-conforming objects to
   *    search over.
   *
   * @returns - A Promise resolving to a list of ICommandSearchResult
   *    objects.
   *
   * #### Notes
   * This method with the private _processResults encapsulates the
   * external fuzzy matching library. No details of the library used
   * should leak outside of this public API.
   */
  search(query: string, commands: ICommandItem[]): Promise<ICommandMatchResult[]> {
    let searcher: any = (new FuzzySearch(commands, {
      'minimumScore': 300,
      termPath: 'id'
    })) as any;
    searcher.addModule(indexOfFS({
      'minTermLength': 3,
      'maxIterations': 500,
      'factor': 3
    }));
    searcher.addModule(wordCountFS({
      'maxWordTolerance': 3,
      'factor': 1
    }));

    let result = searcher.search(query);
    return Promise.resolve(this._processResults(result));
  }

  private _processResults(results: any[]): ICommandMatchResult[] {
    let retval: ICommandMatchResult[] = [];
    for (let i = 0; i < results.length; ++i) {
      let res = results[i];
      let item = {
        score: res.score,
        originalText: res.value.id,
        command: res.value
      };
      retval.push(res);
    }
    return retval;
  }

}
