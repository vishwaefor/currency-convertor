# Currency Convertor

This programme could find the best currency conversion possible for the customers by trading currencies for other currencies since there is no direct conversion exists.

    Example

    Convert CAD to EUR
    CAD -> GBP -> EUR

    There are no cycles
    CAD -> GBP -> EUR -> GBP

    How to run

    Why to use BelmonFord

## How to run

- `yarn install` : installing dependencies
- `yarn start` : runnig application taking data from the API
- `yarn test` : runnig application taking data from the mock-data`
- `yarn web` : runnig a web server and showing a table`

index.ts file is the entry point.

    (async () => {
        const dataUrl =
        process.env.DATA_URL ||
        'https://api-coding-challenge.neofinancial.com/currency-conversion?seed=88662';

        new App(dataUrl, 'REST').run(100, 'CAD');
    })();

## Approach

This is forming a graph among currencies. The best conversion is the maximum value of the multiplication of exchange rates among the paths possible from one currency to another currency. The paths should not have cycles

The problem could be converted to a minimization problem by taking the inverse weights.

It is possible to convert the multiplication of weights into summation by taking the log values.

Considering both aspects, the graph is simplified with the values of "-log(exchange_rate)" as the weights among the nodes which are the currencies.

Hence, finding the shortest path from a source to other nodes would provide the best exchange rates.

### Algorithm

It is common to use Dijkstra algorithms to find the shortest paths from a single source. But due to the negative values of the logrithmic weights, using this algorithm would not give the correct results.

Bellmanford algorithm is capeable of handling negative weights and used here for finding the shortest path.

## Results

The results of the conversions are written in to a CSV file and save under a given directory.

## Web Page

Please note the web site is just for showing the results
