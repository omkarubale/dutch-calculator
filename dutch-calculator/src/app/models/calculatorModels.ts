export class ItemDetailsDto {
  Id: number;
  Name: string;
  Quantity: number;
  Rate: number;
}

export class GridItemDto extends ItemDetailsDto {
  TotalShares: number;
  PendingToAllocate: boolean;
}

export class MemberDto {
  Id: number;
  Name: string;
  BillShares: { [itemId: number] : GridMemberShareDto };
}

export class MemberShareDto {
  ItemId: number;
  Share: number;
}

export class GridMemberShareDto extends MemberShareDto {
  Price: number;
}

export class GridDto {
  Members: MemberDto[];
  BillItems: GridItemDto[];
  BillTotal: number;
}
