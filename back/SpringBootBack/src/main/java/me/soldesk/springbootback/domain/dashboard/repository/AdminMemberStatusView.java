package me.soldesk.springbootback.domain.dashboard.repository;

public interface AdminMemberStatusView {

    Long getActiveMembers();
    Long getSuspendedMembers();
    Long getWithdrawnMembers();
}
