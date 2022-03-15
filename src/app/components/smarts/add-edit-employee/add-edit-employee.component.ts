import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee, CivilStatus } from 'src/app/util/interface/employee/employee';


@Component({
  selector: 'app-add-edit-employee',
  templateUrl: './add-edit-employee.component.html',
  styleUrls: ['./add-edit-employee.component.scss'],
})
export class AddEditEmployeeComponent implements OnInit, OnDestroy, AfterViewInit {
  public status: CivilStatus[] = [
    { value: 'Single', status: 'Single' },
    { value: 'Married', status: 'Married' },
    { value: 'Other', status: 'Other' },
  ];

  public employeeId: string;
  public action: string = 'Add';

  public employeeForm: FormGroup;

  public subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: Router,
    private aRoute: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      joinDate: [, Validators.required],
      gender: ['', Validators.required],
    });
    this.employeeId = this.aRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    if (this.employeeId !== undefined) {
      this.action = 'Edit';
      this.getEmployee();
    }
  }

  ngAfterViewInit(): void {
    if (this.employeeId !== undefined) {
      this.action = 'Edit';
      this.getEmployee();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submitEmployee() {
    const employee: Employee = {
      name: this.employeeForm.get('name').value,
      email: this.employeeForm.get('email').value,
      phone: this.employeeForm.get('phone').value,
      maritalStatus: this.employeeForm.get('maritalStatus').value,
      joinDate: this.employeeForm.get('joinDate').value,
      gender: this.employeeForm.get('gender').value,
    };

    if (this.employeeId !== undefined) {
      this.updateEmployee(employee);
    } else {
      this.addEmployee(employee);
    }
  }

  public getEmployee() {
    this.subscriptions.add(
      this.employeeService
        .getEmployeeForEdit(this.employeeId)
        .subscribe((data) => {
          const employee = {
            name: data._delegate._document.data.value.mapValue.fields.name
              .stringValue,
            email:
              data._delegate._document.data.value.mapValue.fields.email
                .stringValue,
            phone:
              data._delegate._document.data.value.mapValue.fields.phone
                .stringValue,
            maritalStatus:
              data._delegate._document.data.value.mapValue.fields.maritalStatus
                .stringValue,
            joinDate:
              data._delegate._document.data.value.mapValue.fields.joinDate
                .timestampValue,
            gender:
              data._delegate._document.data.value.mapValue.fields.gender
                .stringValue,
          };

          this.employeeForm.patchValue({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            maritalStatus: employee.maritalStatus,
            joinDate: employee.joinDate,
            gender: employee.gender,
          });
        })
    );
  }

  public addEmployee(employee: Employee) {
    this.employeeService.saveEmployee(employee).then(
      () => {
        this.route.navigate(['/']);
      },
      (err) => console.log('error', err)
    );
  }

  public updateEmployee(employee: Employee) {
    this.employeeService.updateEmployee(this.employeeId, employee).then(
      () => {
        this.route.navigate(['/']);
      },
      (err) => console.log('error', err)
    );
  }
}
