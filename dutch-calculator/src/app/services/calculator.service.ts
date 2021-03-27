import { Injectable } from '@angular/core';
import { GridDto } from '../models/calculatorModels';

@Injectable()
export class CalculatorService {
  private grid: GridDto;

  constructor() { }
}
