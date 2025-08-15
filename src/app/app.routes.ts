import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DemandeeventComponent } from './components/demandeevent/demandeevent.component';
import { ListeuserComponent } from './components/listeuser/listeuser.component';
import { DashbordSuperieurHeararchiqueComponent } from './components/dashbord-superieur-heararchique/dashbord-superieur-heararchique.component';
import { DashboardRHComponent } from './components/dashboard-rh/dashboard-rh.component';

import { ModifierProfilComponent } from './components/modifier-profil/modifier-profil.component';
import { ReponseDemandeComponent } from './components/reponse-demande/reponse-demande.component';
import { ListefournisseurComponent } from './components/listefournisseur/listefournisseur.component';

import { InvitationserviceService } from './services/invitationservice.service';
import { ListInvitationsComponent } from './components/list-invitations/list-invitations.component';
import { EnvoyerInvitationComponent } from './components/envoyer-invitation/envoyer-invitation.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProfilComponent } from './components/profil/profil.component';

import { Component } from '@angular/core';
import { CreateEVFinalDialogComponent } from './components/create-evfinal-dialog/create-evfinal-dialog.component';
import { ListeEventComponent } from './components/liste-event/liste-event.component';
import { StatsEvenementsComponent } from './components/stats-evenements/stats-evenements.component';
import { EvolutionTopCategorieComponent } from './components/evolution-top-categorie/evolution-top-categorie.component';
import { FournisseurServiceService } from './services/fournisseur-service.service';
import { StatFournisseurComponent } from './components/stat-fournisseur/stat-fournisseur.component';

import { PluscherEventComponent } from './components/pluscher-event/pluscher-event.component';
import { TauxParticipationComponent } from './components/taux-participation/taux-participation.component';



export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,  
  },

  



 {
    path: 'dashboard/RH',
    component: DashboardRHComponent,  
     children :[
      {path:'',redirectTo:'statstique', pathMatch:'full'},
       {path:'statstique',component:StatsEvenementsComponent},
       { path:'listeuser',  component:ListeuserComponent} ,
     
      {path:'reponse-demande', component:ReponseDemandeComponent},
     { path: 'fournisseurs', component: ListefournisseurComponent },
 
      {path:'invitation', component:ListInvitationsComponent},
      {path:'envoyerinvitation', component : EnvoyerInvitationComponent},
      {path:'profil', component:ProfilComponent},
      {path:'createvfinaldialog',component:CreateEVFinalDialogComponent},
      {path:'listeFinaledialog',component:ListeEventComponent},
      
       {path:'categories',component:EvolutionTopCategorieComponent},
       {path:'fournisseur',component:StatFournisseurComponent},
       {path:'plus-cher', component:PluscherEventComponent},
       {path:'taux-participant',component:TauxParticipationComponent},
    

    ]
 
},

 {
    path: 'dashboard/superieur',
    component: DashbordSuperieurHeararchiqueComponent,  
    children:[
      {path:'evenement',
        component:DemandeeventComponent
      },
      {path:'modifier-profil', component: ModifierProfilComponent},
      {path:'calander', component: CalendarComponent},
      {path:'profil', component:ProfilComponent},
     
      
    
     
    ]
     
  
 
},


    

   {
    path: 'authentication',
    loadChildren: () =>
      import('./pages/authentication/authentication.routes').then(
        (m) => m.AuthenticationRoutes
      ),
  },
  

  {
    path: '**',
    redirectTo: '',  // Toute route inconnue revient à la home
  },
    
];
