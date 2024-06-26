import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateMember } from 'src/app/_interfaces/create-member';
import { Member } from 'src/app/_interfaces/member';
import { MemberService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styles: [],
})
export class MemberListComponent implements OnInit {
  members: Member[] = [];
  openCreateModal = false;
  openUpdateModal = false;
  updateId : number = 0;

  errorMessage = '';

  createForm : FormGroup = new FormGroup({});
  updateForm : FormGroup = new FormGroup({});

  toggleCreate(){
    this.openCreateModal = !this.openCreateModal;
  }

  toggleUpdate(){
    this.openUpdateModal = !this.openUpdateModal;
  }


  constructor(private memberService: MemberService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (members) => {
        this.members = members;
      },
    });
    this.initializeCreateForm();
    this.initializeUpdateForm();
  }

  initializeCreateForm(){
    this.createForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      email: ['',[Validators.required,Validators.email]],
      semester: [0,Validators.required, Validators.min(1), Validators.max(10)],
      career: ['',Validators.required, Validators.minLength(3),Validators.maxLength(50)]
    });
  }

  initializeUpdateForm(){
    this.createForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(20)]],
      email: ['',[Validators.required,Validators.email]],
      semester: [0,Validators.required, Validators.min(1), Validators.max(10)],
      career: ['',Validators.required, Validators.minLength(3),Validators.maxLength(50)]
    });
  }

  getId(id : number){
    this.updateId = id;
  }

  createMember(){
    this.memberService.createMember(this.createForm.value).subscribe({
      next: (result: Member) => {
        this.members.push(result);
        this.toggleCreate();
        this.router.navigateByUrl('members');
      },
      error: (result) => {
        if (typeof result.error === 'string') {
          this.errorMessage = result.error;
          console.log(this.errorMessage);
        } else {
          this.errorMessage = 'Intente nuevamente';
        }
      },

    })
  }

  updateMember(){
    this.memberService.updateMember(this.updateId,this.updateForm.value).subscribe({
      next: (result: Member) => {
        this.toggleUpdate();
        this.router.navigateByUrl('members');
      },
      error: (result) => {
        if (typeof result.error === 'string') {
          this.errorMessage = result.error;
          console.log(this.errorMessage);
        } else {
          this.errorMessage = 'Intente nuevamente';
        }
      },

    })
  }

}
