import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class VoiceAssistantService {
  private endpointUrl = 'https://turnquest-ai.turnkeyafrica.com/voice/';

  constructor(private http: HttpClient) { }

  getAssitants(): Observable<any> {
    return this.http.get<any>(`${this.endpointUrl}assistants`);
  }
  startCall(data: any){
    console.log("Data",JSON.stringify(data))
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      
    });
    return this.http.post(`${this.endpointUrl}call/phone`, JSON.stringify(data),{headers:headers})
      
  }

  getCallContents(callId:any){
    return this.http.get<any>(`${this.endpointUrl}call/${callId}?type=end-of-call-report`);
  }
}
