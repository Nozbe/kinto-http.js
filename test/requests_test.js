"use strict";

import chai, { expect } from "chai";

import * as requests from "../src/requests";


chai.should();
chai.config.includeStack = true;


describe("requests module", () => {
  describe("createBucket()", () => {
    it("should return a bucket creation request", () => {
      expect(requests.createBucket("foo")).eql({
        body: {
          permissions: {}
        },
        headers: {},
        method: "PUT",
        path: "/buckets/foo",
      });
    });

    it("should throw if bucketName is missing", () => {
      expect(() => requests.createBucket()).to.Throw(Error, /required/);
    });

    it("should accept a headers option", () => {
      expect(requests.createBucket("foo", {headers: {Foo: "Bar"}}))
        .to.have.property("headers").eql({Foo: "Bar"});
    });

    it("should accept a permissions option", () => {
      const permissions = {read: ["github:n1k0"]};
      expect(requests.createBucket("foo", {permissions}))
        .to.have.property("body")
        .to.have.property("permissions").eql(permissions);
    });
  });

  describe("createCollection()", () => {
    it("should return a collection creation request when an id is provided", () => {
      expect(requests.createCollection({id: "foo"})).eql({
        body: {
          permissions: {},
          data: {}
        },
        headers: {},
        method: "PUT",
        path: "/buckets/default/collections/foo",
      });
    });

    it("should return a collection creation request when no id is provided", () => {
      expect(requests.createCollection()).eql({
        body: {
          permissions: {},
          data: {}
        },
        headers: {},
        method: "POST",
        path: "/buckets/default/collections",
      });
    });

    it("should accept a bucket option", () => {
      expect(requests.createCollection({id: "foo", bucket: "custom"}))
        .to.have.property("path").eql("/buckets/custom/collections/foo");
    });

    it("should accept a headers option", () => {
      expect(requests.createCollection({id: "foo", headers: {Foo: "Bar"}}))
        .to.have.property("headers").eql({Foo: "Bar"});
    });

    it("should accept a permissions option", () => {
      const permissions = {read: ["github:n1k0"]};
      expect(requests.createCollection({id: "foo", permissions}))
        .to.have.property("body")
        .to.have.property("permissions").eql(permissions);
    });
  });

  describe("createRecord()", () => {
    const record = {title: "foo"};

    it("should throw if collName is missing", () => {
      expect(() => requests.createRecord())
        .to.Throw(Error, /required/);
    });

    it("should return a record creation request", () => {
      expect(requests.createRecord("foo", record)).eql({
        body: {
          permissions: {},
          data: record
        },
        headers: {},
        method: "POST",
        path: "/buckets/default/collections/foo/records",
      });
    });

    it("should accept a bucket option", () => {
      expect(requests.createRecord("foo", record, {bucket: "custom"}))
        .to.have.property("path").eql("/buckets/custom/collections/foo/records");
    });

    it("should accept a headers option", () => {
      expect(requests.createRecord("foo", record, {headers: {Foo: "Bar"}}))
        .to.have.property("headers").eql({Foo: "Bar"});
    });

    it("should accept a permissions option", () => {
      const permissions = {read: ["github:n1k0"]};
      expect(requests.createRecord("foo", record, {permissions}))
        .to.have.property("body")
        .to.have.property("permissions").eql(permissions);
    });

    describe("should add cache headers when the safe option is true", () => {
      it("for a record with no last_modified", () => {
        expect(requests.createRecord("foo", record, {safe: true}))
          .to.have.property("headers")
          .eql({"If-None-Match": "*"});
      });

      it("for a record with last_modified set", () => {
        const existingRecord = {...record, last_modified: 42};
        expect(requests.createRecord("foo", existingRecord, {safe: true}))
          .to.have.property("headers")
          .eql({"If-Match": "\"42\""});
      });
    });
  });

  describe("updateRecord()", () => {
    const record = {id: 1, title: "foo"};

    it("should throw if collName is missing", () => {
      expect(() => requests.updateRecord())
        .to.Throw(Error, /required/);
    });

    it("should return a record creation request", () => {
      expect(requests.updateRecord("foo", record)).eql({
        body: {
          permissions: {},
          data: record
        },
        headers: {},
        method: "PUT",
        path: "/buckets/default/collections/foo/records/1",
      });
    });

    it("should accept a bucket option", () => {
      expect(requests.updateRecord("foo", record, {bucket: "custom"}))
        .to.have.property("path").eql("/buckets/custom/collections/foo/records/1");
    });

    it("should accept a headers option", () => {
      expect(requests.updateRecord("foo", record, {headers: {Foo: "Bar"}}))
        .to.have.property("headers").eql({Foo: "Bar"});
    });

    it("should accept a permissions option", () => {
      const permissions = {read: ["github:n1k0"]};
      expect(requests.updateRecord("foo", record, {permissions}))
        .to.have.property("body")
        .to.have.property("permissions").eql(permissions);
    });

    describe("should add cache headers when the safe option is true", () => {
      it("for a record with no last_modified", () => {
        expect(requests.createRecord("foo", record, {safe: true}))
          .to.have.property("headers")
          .eql({"If-None-Match": "*"});
      });

      it("for a record with last_modified set", () => {
        const existingRecord = {...record, last_modified: 42};
        expect(requests.createRecord("foo", existingRecord, {safe: true}))
          .to.have.property("headers")
          .eql({"If-Match": "\"42\""});
      });
    });
  });
});
