export const webClientId="22508516978-lit3kcob3vsl01vvt2r8ckf1f9v16425.apps.googleusercontent.com"
export const iosClientId="22508516978-eu80laa0to9enuorg1e0bfd8s44j25fi.apps.googleusercontent.com"
export const androidClientId="22508516978-e4eo2hurpun5bs0cu9vc2atktpo04d2k.apps.googleusercontent.com"
export const facebookClientId="1991459454608166";


export const getRemainingTime = (biddingEndDate) => {
    const now = new Date();
    const endDate = new Date(biddingEndDate);
    const remainingTimeInMs = endDate - now;
  
    if (remainingTimeInMs <= 0) {
      return { formattedTime: null, remainingTimeInMs };
    }
  
    const days = Math.floor(remainingTimeInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTimeInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTimeInMs % (1000 * 60 * 60)) / (1000 * 60));
  
    // Build formatted time string based on available time units
    let formattedTime = '';
    if (days > 0) {
      formattedTime += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0 || days > 0) {
      formattedTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0 || (days === 0 && hours === 0)) {
      formattedTime += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
  
    return { formattedTime: formattedTime.trim(), remainingTimeInMs };
  }; 