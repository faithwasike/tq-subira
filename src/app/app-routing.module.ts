import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { VoiceComponent } from './voice/voice.component';
import { RenewalComponent } from './renewal/renewal.component';
import { LoginComponent } from './login/login.component';
import { RenewalListComponent } from './renewal-list/renewal-list.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {path:'voiceAssistant/:name',component:VoiceComponent},
  {path:'renewal',component:RenewalComponent},
  {path:'',component:LoginComponent},
  {path:'renewalList',component:RenewalListComponent},
  {path:'campaign',component:CampaignsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
