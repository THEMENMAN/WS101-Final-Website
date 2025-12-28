package com.service;

import java.util.Optional;

import com.model.Proposal;
import com.model.ProposalStatus;
import com.model.User;

public class ProposalRepository {

    public Optional<User> findByFreelancerIdAndJobId(Long id, Long jobId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByFreelancerIdAndJobId'");
    }

    public Optional<User> findByFreelancer(org.apache.catalina.User freelancer) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByFreelancer'");
    }

    public Optional<User> findByJob(Long proposalId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByJob'");
    }

    public Optional<User> findByFreelancerAndStatus(org.apache.catalina.User freelancer, ProposalStatus valueOf) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findByFreelancerAndStatus'");
    }

    public Proposal save(Proposal proposal) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'save'");
    }

}
