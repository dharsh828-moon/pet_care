package com.petcare.vaccination_reminder.controller;

import com.petcare.vaccination_reminder.entity.Owner;
import com.petcare.vaccination_reminder.service.ownerservice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/owners")
public class ownercontroller {

    private final ownerservice ownerService;

    public ownercontroller(ownerservice ownerService) {
        this.ownerService = ownerService;
    }

    @PostMapping
    public Owner addOwner(@RequestBody Owner owner) {
        return ownerService.addOwner(owner);
    }

    @GetMapping
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public Owner getOwner(@PathVariable Long id) {
        return ownerService.getOwner(id);
    }

    @DeleteMapping("/{id}")
    public String deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
        return "Owner deleted successfully";
    }
}