import { Component, ElementRef, ViewChild, AfterViewInit,Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VoiceAssistantService } from '../services/voiceAssistant/voice-assistant.service';
declare var webkitSpeechRecognition: any;
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

interface CustomSpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

@Component({
  selector: 'app-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChild('audioVisualizer') audioVisualizer!: ElementRef;

  context!: AudioContext;
  analyser!: AnalyserNode;
  dataArray!: Uint8Array;
  canvasCtx!: CanvasRenderingContext2D;
  assistant:any;
  status:any;
  recordingUrl:any;
  showStatus:boolean = true
  pollingActive: boolean = true;
  titles: string[] = [
    "Introduction and Confirmation of Policy Details",
    "Review of Current Coverage",
    "Claim History Confirmation",
    "Discussion on Policy Renewal Options",
    "Premium and Payment Details",
    "Next Steps and Closing"
  ];
  loading: boolean = false;
  versions = [  {
    width: '200px',
    height: '60px',
    color: '#00529B'
  }, ];
  values: any[] = [
    { value: 'Introduction', timestamp: 16510 },
    { value: 'Client Verification', timestamp: 72000 },
    { value: 'Confirmation of  policy details', timestamp: 130800 },
    { value: 'Discussion on Policy Renewal Options', timestamp: 330000 },
    { value: 'Confirmation of policy renewal', timestamp: 438000 },
    { value: 'Closing', timestamp: 452400 }
  ];
  completed: boolean[] = new Array(this.titles.length).fill(false);
  constructor(
     private route: ActivatedRoute,
     private renderer: Renderer2,
     private el: ElementRef,
     public voiceAssistantService:VoiceAssistantService
     ){}
  ngOnInit(): void{
    this.assistant = this.route.snapshot.paramMap.get('name');
   
    this.startPolling()
    this.startPlayback()
       // Initialize speech recognition
      //  const recognition = new webkitSpeechRecognition();
      //  recognition.lang = 'en-US';
      //  recognition.continuous = true;
      //  recognition.interimResults = true;
   
       // Start recognition
      //  recognition.start();
   
       // Listen for results
      //  recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
      //    const transcript = event.results[event.results.length - 1][0].transcript;
       
   
         // Check if transcript contains any of the agenda items
      //    this.titles.forEach((title, index) => {
      //      if (transcript.toLowerCase().includes(title.toLowerCase())) {
      //        this.completed[index] = true;
      //      }
      //    });
      //  };
     }
  
  ngAfterViewInit() {
    // this.setupAudio();
    // this.setupVisualizer();
    // this.visualize();
   

  }
  startPlayback() {
    this.setupAudio();
    this.setupVisualizer();
    this.visualize();
   

  }




  setupAudio() {
    this.context = new AudioContext();
    const source = this.context.createMediaElementSource(this.audioPlayer.nativeElement);
    this.analyser = this.context.createAnalyser();
    source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }
  setupVisualizer() {
    const canvas = this.audioVisualizer.nativeElement;
    this.canvasCtx = canvas.getContext('2d');
  }

  visualize() {
    const draw = () => {
      requestAnimationFrame(draw);
      this.analyser.getByteFrequencyData(this.dataArray);
      this.canvasCtx.clearRect(0, 0, this.audioVisualizer.nativeElement.width, this.audioVisualizer.nativeElement.height);
      const barWidth = (this.audioVisualizer.nativeElement.width / this.dataArray.length) * 5; // Increase the bar width
      const amplitude = this.audioVisualizer.nativeElement.height / 8;
      const frequency = 2 * Math.PI / this.dataArray.length;
      let x = 0;
      this.canvasCtx.fillStyle = '#00529B'; // Set fill color
      for (let i = 0; i < this.dataArray.length; i++) {
        const offsetY = amplitude * Math.sin(i * frequency);
        const barHeight = (this.dataArray[i] / 2) + offsetY;
        // Draw bar above the axis
        this.canvasCtx.fillRect(x, (this.audioVisualizer.nativeElement.height / 2) - (barHeight / 2), barWidth, barHeight); // Adjust the height calculation
        // Draw bar below the axis
        this.canvasCtx.fillRect(x, (this.audioVisualizer.nativeElement.height / 2), barWidth, -barHeight); // Adjust the height calculation
        x += (barWidth + 5); // Increase the spacing
      }
    };
    draw();
  }
  changeFontColors() {
    this.values.forEach((item, index) => {
      setTimeout(() => {
        // Change font color to blue
        item.color = '#00529B';
      }, item.timestamp); // Convert seconds to milliseconds
    });
  }
  getCallDetails(){
    const callId = sessionStorage.getItem('callID')
    this.voiceAssistantService.getCallContents(callId).subscribe(res=>{
      console.log(callId)
      console.log(res)
    })
  }

  startPolling(): void {
    const callId = sessionStorage.getItem('callID')
    interval(2000) // 2000 milliseconds = 2 seconds
      .pipe(
        takeWhile(() => this.pollingActive) // Continue polling until explicitly stopped
      )
      .subscribe(() => {
        this.voiceAssistantService.getCallContents(callId).subscribe(
          (data) => {
            // Handle data from the API response
            console.log(data)
           
            this.status = data.provider_data.status;
            if (data.provider_data.status === 'ended') {
              this.pollingActive = false;
              this.recordingUrl=data.provider_data.recordingUrl
              this.showStatus=false
             
            }
          },
          (error) => {
            // Handle errors
            console.error(error);
            this.pollingActive = false; // Stop polling on error
          }
        );
      });
  }
  
}
