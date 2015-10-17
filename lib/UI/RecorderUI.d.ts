import VideoEvents from '../Helpers/VideoEvents';
import VideoTimer from '../Helpers/VideoTimer';
import { IElement, Panel } from './BasicElements';
import BrushSize from './Brush';
import Color from '../UI/Color';
import * as Localization from '../Localization/Recorder';
export default class RecorderUI extends Panel {
    private id;
    protected events: VideoEvents;
    private board;
    private controls;
    private timeDisplay;
    private isRecording;
    private micIsMuted;
    Width: number;
    Height: number;
    BackgroundColor: string;
    Localization: Localization.Recorder;
    Timer: VideoTimer;
    private isBusy;
    constructor(id: string, events: VideoEvents);
    CreateHTML(autohide: boolean, colorPallete: Array<Color>, brushSizes: Array<BrushSize>): void;
    Busy(): void;
    Ready(): void;
    SetBusyText(text: string): void;
    AcceptCanvas(canvas: Element): void;
    private CreateBoard();
    private recPauseButton;
    private uploadButton;
    private CreateButtonsPanel();
    private RecordPause();
    private ticking;
    private tickingInterval;
    private StartRecording();
    private PauseRecording();
    private Tick();
    private InitializeUpload();
    private CreateColorsPanel(colorPallete);
    private CreateBrushSizesPanel(brushSizes);
    private currentColor;
    private switchToEraserButton;
    private eraseAllButton;
    private CreateEraserPanel();
    private CreateEraseAllPanel();
    private EraseAll();
    private micButton;
    protected CreateMicPanel(): IElement;
    protected MuteMic(): void;
}
