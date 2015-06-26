 module Helpers {     
    
    /**
    * Converts an integer value of seconds to a human-readable time format - "0:00"
    * @param  s seconds
    * @return Human readable time
    */
    export function secondsToString(s: number) : string {
        var time: string;
        var minutes: number = Math.floor(s / 60);
        time = `${minutes}:`;
        
        var seconds: number = Math.floor(s % 60);
        if(seconds <= 9) {
            time += `0${seconds.toString(10)}`; // seconds should have leading zero if lesser than 10
        } else {
            time += seconds.toString(10);
        }
        
        return time;
    };
    
    /**
    * Converts an integer value of milliseconds to a human-readable time format - "0:00"
    * @param  ms     Time in milliseconds
    * @return Human readable time
    */
    export function millisecondsToString(ms: number) : string {
        return secondsToString(Math.floor(ms / 1000));
    };
 }