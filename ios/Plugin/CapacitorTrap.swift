import Foundation

@objc public class CapacitorTrap: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
