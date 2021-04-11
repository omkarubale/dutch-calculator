import { Injectable } from '@angular/core';
import { GridDto, GridItemDto, GridMemberShareDto, ItemDetailsDto, MemberDto } from '../models/calculatorModels';

@Injectable()
export class CalculatorService {
  private items: { [id: number] : ItemDetailsDto } = {};
  private members: { [id: number] : MemberDto } = {};
  private isGridReady: boolean = false;
  public grid: GridDto = new GridDto();

  constructor() { }

  //#region Item
  addItem(item: ItemDetailsDto) {
    let itemsCount = Object.keys(this.items).length;
    item.Id = itemsCount;
    this.items[item.Id] = item;

    if (this.isGridReady) {
      this.addGridItem(item);
    }
  }

  saveItem(item: ItemDetailsDto) {
    this.items[item.Id] = item;

    if(this.isGridReady) {
      this.saveGridItem(item);
      this.calculatePricesForGridItem(item.Id);
    }
  }

  removeItem(itemId: number) {
    delete this.items[itemId];
  }
  //#endregion

  //#region Member
  addMember(member: MemberDto) {
    let membersCount = Object.keys(this.members).length;
    member.Id = membersCount;
    this.members[member.Id] = member;
  }

  saveMember(member: MemberDto) {
    this.members[member.Id] = member;
  }

  removeMember(memberId: number) {
    delete this.members[memberId];
  }
  //#endregion

  //#region Member shares
  addSharesForMember(memberId: number, itemId: number, share: number) {
    if ((memberId in this.members) && (itemId in this.items)) {
      this.members[memberId].BillShares[itemId] = new GridMemberShareDto();

      this.members[memberId].BillShares[itemId].ItemId = itemId,
      this.members[memberId].BillShares[itemId].Share = share
    }
  }
  //#endregion

  //#region Grid items
  addGridItem(item: ItemDetailsDto) {
    let billItem = new GridItemDto();

    billItem.Id = item.Id;
    billItem.Name = item.Name;
    billItem.Quantity = item.Quantity;
    billItem.Rate = item.Rate;
    billItem.TotalShares = 0;
    billItem.PendingToAllocate = true;

    this.grid.BillItems.push(billItem);
  }

  saveGridItem(item: ItemDetailsDto) {
    let billItem = this.grid.BillItems.find(bi => bi.Id == item.Id);

      billItem.Name = item.Name;
      billItem.Quantity = item.Quantity;
      billItem.Rate = item.Rate;
  }
  //#endregion

  //#region Calculate methods
  calculatePrices() {
    this.isGridReady = true;
    // setup items
    for (const [key, value] of Object.entries(this.items)) {
      let found = this.grid.BillItems.some(m => m.Id == value.Id);

      if (!found) {
        this.addGridItem(value);
      }
      else {
        this.saveGridItem(value);
      }
    }

    // setup members
    for (const [key, value] of Object.entries(this.members)) {
      let found = this.grid.Members.some(m => m.Id == value.Id);

      if (found) {
        this.grid.Members.find(obj => { return obj.Id == value.Id }).Name = value.Name;
        this.grid.Members.find(obj => { return obj.Id == value.Id }).BillShares = value.BillShares;
      }
      else {
        this.grid.Members.push(value);
      }

      // updated Grid's Bill Items
      for(const [bKey, bValue] of Object.entries(value.BillShares)) {
        let billItem = this.grid.BillItems.find(obj => { return obj.Id == bValue.ItemId });

        if (bValue.Share != undefined && bValue.Share > 0) {
          billItem.TotalShares += bValue.Share;
          billItem.PendingToAllocate = false;
        }
      }
    }

    this.grid.BillItems.forEach(item => this.calculatePricesForGridItem(item.Id));
  }

  calculatePricesForGridItem(itemId: number) {
    let totalShares = 0;
    let item = this.grid.BillItems.find(i => i.Id == itemId);

    this.grid.Members.forEach(i => totalShares += i.BillShares[itemId].Share);
    item.TotalShares = totalShares;
    this.grid.Members.forEach(i => i.BillShares[itemId].Price = (i.BillShares[itemId].Share / totalShares) * item.Quantity * item.Rate);
  }
  //#endregion
}
