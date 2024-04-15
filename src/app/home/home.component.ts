import { Component,ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { VoiceAssistantService } from '../services/voiceAssistant/voice-assistant.service';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  showVideo: boolean = false;
  @ViewChild('videoPlayer')videoPlayer!: ElementRef;
  assistant:any;
  assistantList:any;
  clientDetailsForm!:FormGroup
  callDetails:any
  loading: boolean = false;
  versions = [  {
    width: '200px',
    height: '60px',
    color: '#00529B'
  }, ];
  constructor( 
    private router: Router,
    private voiceAssistantService:VoiceAssistantService,
    public fb: FormBuilder,
    ){}

  ngOnInit(){
    this.getAssistants();
    this.createForm()
  }
  detailSubmission(){
    this.router.navigate(['voiceAssistant/'+this.assistant])
  }
  assignAssistant(name:any){
    this.assistant = name
  }
  getAssistants(){
    this.voiceAssistantService.getAssitants().subscribe(
      (res=>{
        this.assistantList = res
        console.log(res)
      })
    )
  }
  
  createForm(){
    this.clientDetailsForm = this.fb.group({
      assistant:[''],
      phone_number:[''],
      client_name:['']
    })
  }
  onSubmit() {
    this.loading = true;
    const formData = this.clientDetailsForm.value;
    const payload = {
      assistant: this.assistant,
      phone_number: formData.phone_number,
      context: {
        client_name: formData.client_name
      }
    };
    this.voiceAssistantService.startCall(payload).subscribe(res=>{
      this.callDetails=res
      console.log(res)
      sessionStorage.setItem('callID', this.callDetails.id);
      this.loading = false; 
      this.detailSubmission()
    })
    console.log(payload); 
  }
  playVideo() {
    this.showVideo = true;
    this.videoPlayer.nativeElement.play();
  }
}
