import './style.css';

import { AppComponent } from '@/pages/app.component';
import { garageService } from '@/services/garage.service';
import { raceService } from '@/services/race.service';
import { winnerService } from '@/services/winner.service';
import { eventEmitter } from '@/utils/event-emmiter';


const app = new AppComponent(garageService, raceService, winnerService, eventEmitter);
app.init();
