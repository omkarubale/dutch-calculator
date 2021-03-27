export class GridDto {
  Members: GridMemberDto[];
  MembersCount: number;
  BillItems: GridBillItemDto[];
  BillTotal: number;
}

export class GridMemberDto {
  Name: string;
  BillShares: GridMemberBillShareDto[];
}


export class GridBillItemDto {
  Name: string;
  Quantity: number;
  Price: number;
}

export class GridMemberBillShareDto {
  BillItemName: string;
  Share: number;
  ShareAmount: number;
}
