import { TestBed } from '@angular/core/testing';

import { InvitationserviceService } from './invitationservice.service';

describe('InvitationserviceService', () => {
  let service: InvitationserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvitationserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
