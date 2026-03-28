package com.erp.repositories;

import com.erp.enities.PartyLedgerEntry;
import com.erp.enums.PartyType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartyLedgerEntryRepository extends JpaRepository<PartyLedgerEntry,Long> {
    List<PartyLedgerEntry> findByPartyTypeAndPartyIdOrderByEntryDateAscIdAsc(PartyType partyType, Long partyId);
}

