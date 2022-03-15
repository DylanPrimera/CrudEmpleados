import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { EmployeeService } from 'src/app/services/employee.service';
import { Employee } from 'src/app/util/interface/employee/employee';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.scss'],
})
export class ListEmployeesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'maritalStatus',
    'joinDate',
    'gender',
    'actions',
  ];
  public dataSource = new MatTableDataSource();
  public listEmployees: Employee[];
  public spinner: Boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  ngAfterViewInit(): void {
    this.getEmployees();
  }

  public applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }


  public getEmployees() {
    this.spinner = true;
    this.employeeService.getEmployee().subscribe((data) => {
      this.listEmployees = [];
      data.forEach((element: any) => {
        this.listEmployees.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });
      this.dataSource = new MatTableDataSource(this.listEmployees);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.spinner = false;
    });
  }

  public deleteEmployee(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Delete employee?' },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result === 'yes') {
          this.employeeService.daleteEmployee(id);
          this.snackBar.open('Employee deleted', 'Dismiss');
        }
        this.getEmployees();
      },
      (err) => {}
    );
  }
}
