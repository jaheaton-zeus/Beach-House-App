-- Reason a super user gives when denying a reservation request. It lives on
-- the deny vote and goes into the denial email to the requestor.
ALTER TABLE reservation_votes ADD COLUMN comment TEXT;
