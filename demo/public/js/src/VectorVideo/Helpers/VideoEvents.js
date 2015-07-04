/**
 * Event Aggregator object.
 * @author Šimon Rozsíval
 */
var Helpers;
(function (Helpers) {
    /**
     * The list of supported video events.
     */
    (function (VideoEventType) {
        VideoEventType[VideoEventType["Start"] = 0] = "Start";
        VideoEventType[VideoEventType["Pause"] = 1] = "Pause";
        VideoEventType[VideoEventType["Continue"] = 2] = "Continue";
        VideoEventType[VideoEventType["Stop"] = 3] = "Stop";
        VideoEventType[VideoEventType["ReachEnd"] = 4] = "ReachEnd";
        VideoEventType[VideoEventType["Replay"] = 5] = "Replay";
        VideoEventType[VideoEventType["JumpTo"] = 6] = "JumpTo";
        VideoEventType[VideoEventType["VideoInfoLoaded"] = 7] = "VideoInfoLoaded";
        VideoEventType[VideoEventType["BufferStatus"] = 8] = "BufferStatus";
        VideoEventType[VideoEventType["CursorState"] = 9] = "CursorState";
        VideoEventType[VideoEventType["ChangeColor"] = 10] = "ChangeColor";
        VideoEventType[VideoEventType["ChangeBrushSize"] = 11] = "ChangeBrushSize";
        VideoEventType[VideoEventType["StartPath"] = 12] = "StartPath";
        VideoEventType[VideoEventType["DrawSegment"] = 13] = "DrawSegment";
        VideoEventType[VideoEventType["DrawPath"] = 14] = "DrawPath";
        VideoEventType[VideoEventType["CurrentTime"] = 15] = "CurrentTime";
        VideoEventType[VideoEventType["Render"] = 16] = "Render";
        VideoEventType[VideoEventType["ClearCanvas"] = 17] = "ClearCanvas";
        VideoEventType[VideoEventType["CanvasSize"] = 18] = "CanvasSize";
        VideoEventType[VideoEventType["CanvasScalingFactor"] = 19] = "CanvasScalingFactor";
        VideoEventType[VideoEventType["RegisterRecordingTool"] = 20] = "RegisterRecordingTool";
        VideoEventType[VideoEventType["RecordingToolFinished"] = 21] = "RecordingToolFinished";
        VideoEventType[VideoEventType["RecordingFinished"] = 22] = "RecordingFinished";
        VideoEventType[VideoEventType["StartUpload"] = 23] = "StartUpload";
        VideoEventType[VideoEventType["DownloadData"] = 24] = "DownloadData";
        // DO NOT ADD NEW EVENTS UNDERNEATH:    
        // hack:
        VideoEventType[VideoEventType["length"] = 25] = "length";
    })(Helpers.VideoEventType || (Helpers.VideoEventType = {}));
    var VideoEventType = Helpers.VideoEventType; // if nothing follows "length", then VideoEventType.length gives the total count of valid values        
    var VideoEvent = (function () {
        function VideoEvent(type) {
            this.type = type;
            this.listeners = new Array(0); // prepare a dense empty array
        }
        Object.defineProperty(VideoEvent.prototype, "Type", {
            get: function () { return this.type; },
            enumerable: true,
            configurable: true
        });
        /**
         * Attach a new listener.
         */
        VideoEvent.prototype.on = function (command) {
            this.listeners.push(command);
        };
        /**
         * Remove listener
         */
        VideoEvent.prototype.off = function (command) {
            var index = this.listeners.indexOf(command);
            if (index >= 0) {
                // delete just the one listener
                this.listeners.splice(index, 1);
            }
        };
        /**
         * Trigger this event
         */
        VideoEvent.prototype.trigger = function (args) {
            for (var i = 0; i < this.listeners.length; i++) {
                var cmd = this.listeners[i];
                this.triggerAsync(cmd, args);
            }
        };
        /**
         * Trigger event handle asynchronousely
         */
        VideoEvent.prototype.triggerAsync = function (command, args) {
            setTimeout(function () {
                command.apply(this, args);
            }, 0);
        };
        return VideoEvent;
    })();
    /**
     * Global mediator class.
     * Implements the Mediator design pattern.
     */
    var VideoEvents = (function () {
        function VideoEvents() {
        }
        /**
         * Register new event listener
         */
        VideoEvents.on = function (type, command) {
            if (!VideoEvents.events[type]) {
                VideoEvents.events[type] = new VideoEvent(type);
            }
            VideoEvents.events[type].on(command);
        };
        /**
         * Unregister event listener
         */
        VideoEvents.off = function (type, command) {
            if (!!VideoEvents.events[type]) {
                VideoEvents.events[type].off(command);
            }
        };
        /**
         * Trigger an event
         */
        VideoEvents.trigger = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var e = VideoEvents.events[type];
            if (!!e) {
                e.trigger(args);
            }
        };
        /** Registered events */
        VideoEvents.events = new Array(VideoEventType.length);
        return VideoEvents;
    })();
    Helpers.VideoEvents = VideoEvents;
})(Helpers || (Helpers = {}));