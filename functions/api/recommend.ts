// Collection stays closed until durable storage, mailbox and privacy checks are approved.
// Editorial recommendations are separate from landlord enquiries and agency referrals.
export const onRequestPost = async () => Response.json({
 ok:false, message:"Recommendation collection is paused. Nothing has been sent or stored."
}, {status:503,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
