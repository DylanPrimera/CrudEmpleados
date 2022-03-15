import { Injectable } from '@angular/core';
import { Employee } from '../util/interface/employee/employee';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private firestore: AngularFirestore) {}

  public getEmployee(): Observable<any> {
    return this.firestore
      .collection('employees', (ref) => ref.orderBy('name', 'asc'))
      .snapshotChanges();
  }

  public getEmployeeForEdit(id: string): Observable<any> {
    return this.firestore.collection('employees').doc(id).get();
  }

  public saveEmployee(employee: Employee): Promise<any> {
    return this.firestore.collection('employees').add(employee);
  }

  public updateEmployee(id: string, employee: any): Promise<any> {
    return this.firestore.collection('employees').doc(id).update(employee);
  }

  public daleteEmployee(id: string): Promise<any> {
    return this.firestore.collection('employees').doc(id).delete();
  }

}
