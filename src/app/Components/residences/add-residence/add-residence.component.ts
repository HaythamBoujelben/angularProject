import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResidenceService } from '../../../services/residence.service';
import { Router } from '@angular/router';
import { ResidenceConsumerService } from 'src/app/services/residence-consumer.service';

@Component({
  selector: 'app-add-residence',
  templateUrl: './add-residence.component.html',
  styleUrls: ['./add-residence.component.css'],
})
export class AddResidenceComponent {

  constructor(private _residenceService: ResidenceService, private _router: Router,
    private _consumer:ResidenceConsumerService
  ){}
  residence: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
    status: new FormControl('Disponible', []),
    floor: new FormControl('', [Validators.required, Validators.min(1)]),
    nbreAppartements: new FormControl('', [Validators.required, Validators.min(1)])
  });
  
  get floor() {
    return this.residence.get('floor');
  }
  
  get nbreAppartements() {
    return this.residence.get('nbreAppartements');
  }
  

  add() {
    console.log(this.residence.getRawValue());
    this._consumer.add(this.residence.getRawValue()).subscribe({
      next: () => this._router.navigate(['/residences']),
    });

    
    /*this.residence.patchValue({
      name:'test'
    })
    console.log(this.residence.getRawValue());*/
    this.residence.reset()
  }
}
