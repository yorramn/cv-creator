import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {CommonService} from "../../../services/common.service";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-cv-creator',
  templateUrl: './cv-creator.component.html',
  styleUrls: ['./cv-creator.component.css']
})
export class CvCreatorComponent implements OnInit {
  public userDetailsForm !: FormGroup
  public nacionalities : { name : string }[] = [
    {
      name : 'Brasileiro'
    },
    {
      name : 'Outros'
    }
  ]
  public socialStatus : { name : string }[] = [
    {name : 'Casado'},
    {name : 'Divorciado'},
    {name : 'Solteiro'},
    {name : 'Viúvo'},
    {name : 'União Estável'},
  ]

  public scholarityForm !: FormGroup
  public scholarityLevels : { name : string }[] = [
    {name : 'Ensino Fundamental I Incompleto'},
    {name : 'Ensino Fundamental I Completo'},
    {name : 'Ensino Fundamental II Incompleto'},
    {name : 'Ensino Fundamental II Completo'},
    {name : 'Ensino Médio Incompleto'},
    {name : 'Ensino Médio Completo'},
    {name : 'Graduação Incompleta'},
    {name : 'Graduação Completa'},
    {name : 'Pós-Graduação Incompleta'},
    {name : 'Pós-Graduação Completa'},
    {name : 'Mestrado Incompleto'},
    {name : 'Mestrado Completo'},
    {name : 'Doutorado Incompleto'},
    {name : 'Doutorado Completo'},
  ]

  public experienceForm !: FormGroup

  public skillsForm !: FormGroup
  public rates : Array<number> = []
  public ratesArrayFrom : Array<any> = []

  public states : any[] = []
  public cities : any[] = []
  public citiesScholarity : any[] = []
  public citiesExperience : any[] = []

  public isGenerating : boolean = false
  constructor(
    private formBuilder : FormBuilder,
    private activatedRoute : ActivatedRoute,
    private commonService : CommonService
  ) { }

  async ngOnInit(): Promise<void> {
    this.initializeUserDetailsForm()
    this.initializeScholarityForm()
    this.initializeExperienceForm()
    this.initializeSkillsForm()
    this.states = await this.activatedRoute.snapshot.data['states'].map((value : any) => {
      return {
        name : value.nome,
        sigla : value.sigla
      }
    })
  }

  private initializeUserDetailsForm() : void {
    this.userDetailsForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],

      nacionality:  [null, [Validators.required]],
      social_status : [null, [Validators.required]],
      date_born : [null, [Validators.required]],

      city : [{value: null, disabled: true}, [Validators.required]],
      state : [null, [Validators.required]],
      district : [null, [Validators.required]],

      objective : [null, [Validators.required]],
    })
    this.userDetailsForm.get('state')?.valueChanges
      .subscribe({
        next: data => {
          this.commonService.findAllCities(data).subscribe({
            next: response => {
              this.cities = response.map((value : any) => {
                return {
                  name : value.nome
                }
              })
            }
          })
          this.userDetailsForm.get('city')?.enable()
        }
      })
  }

  private initializeScholarityForm() : void {
    this.scholarityForm = this.formBuilder.group({
      formations : this.formBuilder.array([])
    })
    this.addFormation()
  }

  get formations () : FormArray {
    return this.scholarityForm.get('formations') as FormArray
  }

  public addFormation() : void {
    const formGroup : FormGroup = this.formBuilder.group({
      institute : [null, [Validators.required]],
      title : [null, [Validators.required]],
      scholarity_level : [null, [Validators.required]],
      started_at : [null, [Validators.required]],
      still_studying : [false, [Validators.required]],
      finished_at : [{value : null, disabled : false}, [Validators.required]],
      city : [{value: null, disabled: true}, [Validators.required]],
      state : [null, [Validators.required]],
    })
    this.formations.push(formGroup)
    formGroup.get('state')?.valueChanges
      .subscribe({
        next: data => {
          this.commonService.findAllCities(data).subscribe({
            next: response => {
              this.citiesScholarity = response.map((value : any) => {
                return {
                  name : value.nome
                }
              })
            }
          })
          formGroup.get('city')?.enable()
        }
      })
  }

  public deleteFormation(index : number) : void {
    this.formations.removeAt(index)
  }

  private initializeExperienceForm() : void {
    this.experienceForm = this.formBuilder.group({
      experiences : this.formBuilder.array([])
    })
    this.addExperience()
  }

  get experiences () : FormArray {
    return this.experienceForm.get('experiences') as FormArray
  }

  public addExperience() : void {
    const formGroup : FormGroup = this.formBuilder.group({
      company : [null, [Validators.required]],
      title : [null, [Validators.required]],
      activities : [null, [Validators.required]],
      started_at : [null, [Validators.required]],
      still_working : [false, [Validators.required]],
      finished_at : [{value : null, disabled : false}, [Validators.required]],
      city : [{value : null, disabled : true}, [Validators.required]],
      state : [null, [Validators.required]],
    })
    this.experiences.push(formGroup)
    formGroup.get('state')?.valueChanges
      .subscribe({
        next: data => {
          this.commonService.findAllCities(data).subscribe({
            next: response => {
              this.citiesExperience = response.map((value : any) => {
                return {
                  name : value.nome
                }
              })
            }
          })
          formGroup.get('city')?.enable()
        }
      })
  }

  private initializeSkillsForm() : void {
    this.skillsForm = this.formBuilder.group({
      skills : this.formBuilder.array([])
    })
    this.addSkill()
  }

  get skills () : FormArray {
    return this.skillsForm.get('skills') as FormArray
  }

  public addSkill() : void {
    const formGroup : FormGroup = this.formBuilder.group({
      name : [null, [Validators.required]],
      rate : [0, [Validators.required]],
    })
    this.skills.push(formGroup)
  }

  public changeRate(skillIndex : number) : void {
    this.skills.at(skillIndex).get('rate')?.valueChanges
      .subscribe({
        next : (response) => {
          if(!!this.rates.at(skillIndex)) {
            this.rates.slice(skillIndex, skillIndex)
            this.rates.push(response)
            this.ratesArrayFrom.push(Array.from({length : response}, (value, index) => value))
            return
          }else{
            this.rates.push(response)
            this.ratesArrayFrom.push(Array.from({length : response}, (value, index) => value))
          }
          console.log(this.rates)
        }
      })
  }

  public downloadCvAsPdf(content : any) : void {
    this.isGenerating = true
    const fileName : string = new Date().toLocaleDateString().replace('-', '_') +  '_cv_' + this.userDetailsForm.get('name')?.value + '.pdf'
    const jspdf = new jsPDF({
      orientation: 'p',
      unit: "px",
      format: "a4"
    })
    html2canvas(content).then(canvas => {
      // Few necessary setting options
      var imgWidth = 250;
      var pageHeight = 400;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      jspdf.addImage(contentDataURL, 'PNG', 10, 40, imgWidth, imgHeight)
      jspdf.save(fileName)
      this.isGenerating = false
    });

  }
}
