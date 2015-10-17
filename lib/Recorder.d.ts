import PointingDevice from './VideoData/PointingDevice';
import Video from './VideoData/Video';
import VideoEvents from './Helpers/VideoEvents';
import VideoTimer from './Helpers/VideoTimer';
import { RecorderSettings } from './Settings/RecorderSettings';
export default class Recorder {
    private id;
    private settings;
    private dynaDraw;
    private drawer;
    private audioRecorder;
    private isRecording;
    private ui;
    protected data: Video;
    protected lastEraseData: number;
    protected timer: VideoTimer;
    protected pointer: PointingDevice;
    protected recordingBlocked: boolean;
    private recordAllRawData;
    private events;
    Events: VideoEvents;
    constructor(id: string, settings: RecorderSettings);
    private Start();
    private Pause();
    private StartUpload();
    private ChangeBrushSize(size);
    private ChangeColor(color);
    private ProcessCursorState(state);
    private ClearCanvas(color);
    private PushChunk(chunk);
    private wasRecordingWhenBusy;
    private busyLevel;
    protected Busy(): void;
    protected Ready(): void;
    private UploadData();
    private FinishRecording(success, url?);
}
