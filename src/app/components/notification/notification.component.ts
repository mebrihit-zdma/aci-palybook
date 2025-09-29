import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  // notification List data 
  notificationListData = {
    inboxCount: 4,
    readCount: 2, 
    messages: [ 
      { subject: "Here's What's New in ACI Connectic V1.2.3-A", 
        content: "We've just rolled out the latest product updates. View what's new, improved, or fixed in this release.", 
        datetimeText: "Today at 9:42 AM",
        readStatus: false,
      },
      { subject: "Updated User Manual Now Available", 
        content: "We've added new sections and clarified existing workflows in the user manual. Review the latest guide to stay aligned with system updates.", 
        datetimeText: "Yesterday at 5:30 PM",
        readStatus: false,
      },
      { subject: "Updated", 
        content: " View what's new, improved, or fixed in this release.", 
        datetimeText: "20th February, 2025; 4:30 PM",
        readStatus: true,
      },
      { subject: "XXXX", 
        content: "YYYY", 
        datetimeText: "2nd January, 2025; 2:15 AM",
        readStatus: true,
      },
    ]
  };
  
  listData = this.notificationListData.messages;
  isViewAll = false;
  isNotificationList = false;

  viewAll() {
    console.log("VIEWALL");
    this.isViewAll = !this.isViewAll;
  }

  goToMarkReadAll() {
    for (let dataUpdate of this.notificationListData.messages) {
      dataUpdate.readStatus = true;
    }
  }

  notificationList() {
    console.log("NOTIFICATION");
    this.isNotificationList = !this.isNotificationList;
  }

  closeNotificationList() { 
    this.isNotificationList = false;
  }
}
