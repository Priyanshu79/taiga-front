/*
 * Copyright (C) 2014-2017 Taiga Agile LLC <taiga@taiga.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: asana-import-project-form.controller.coffee
 */

import * as Immutable from "immutable"

export class AsanaImportProjectFormController {
    currentUserService:any
    canCreatePublicProjects:any
    canCreatePrivateProjects:any
    projectForm:any
    platformName:string
    project:any
    limitMembersPrivateProject:any
    limitMembersPublicProject:any
    members:any
    onSaveProjectDetails:any

    static initClass() {
        this.$inject = [
            "tgCurrentUserService"
        ];
    }

    constructor(currentUserService) {
        this.currentUserService = currentUserService;
        this.canCreatePublicProjects = this.currentUserService.canCreatePublicProjects();
        this.canCreatePrivateProjects = this.currentUserService.canCreatePrivateProjects();

        this.projectForm = this.project.toJS();

        this.platformName = "Asana";
        this.projectForm.is_private = false;
        this.projectForm.keepExternalReference = false;
        this.projectForm.project_type = "scrum";

        if (!this.canCreatePublicProjects.valid && this.canCreatePrivateProjects.valid) {
            this.projectForm.is_private = true;
        }
    }

    checkUsersLimit() {
        this.limitMembersPrivateProject = this.currentUserService.canAddMembersPrivateProject(this.members.size);
        return this.limitMembersPublicProject = this.currentUserService.canAddMembersPublicProject(this.members.size);
    }

    saveForm() {
        return this.onSaveProjectDetails({project: Immutable.fromJS(this.projectForm)});
    }

    canCreateProject() {
        if (this.projectForm.is_private) {
            return this.canCreatePrivateProjects.valid;
        } else {
            return this.canCreatePublicProjects.valid;
        }
    }

    isDisabled() {
        return !this.canCreateProject();
    }
}
AsanaImportProjectFormController.initClass();
