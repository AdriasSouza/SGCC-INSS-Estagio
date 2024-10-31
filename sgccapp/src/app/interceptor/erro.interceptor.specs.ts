import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClientModule, HttpClient } from '@angular/common/http';
import { ErroInterceptor } from './erro.interceptor';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('ErroInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErroInterceptor, multi: true }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should catch and log errors', () => {
    httpClient.get('/test').subscribe(
      response => fail('should have failed with the 500 error'),
      (error: string) => {
        expect(error).toContain('Error Code: 500');
      }
    );

    const httpRequest = httpMock.expectOne('/test');

    httpRequest.flush('error', { status: 500, statusText: 'Server Error' });
  });
});